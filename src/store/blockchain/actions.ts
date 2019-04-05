import { BigNumber } from '0x.js';
import { createAction } from 'typesafe-actions';

import {
    MAINNET_ID,
    METAMASK_NOT_INSTALLED,
    METAMASK_USER_DENIED_AUTH,
    START_BLOCK_LIMIT,
    TX_DEFAULTS,
} from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { subscribeToFillEvents } from '../../services/exchange';
import { getGasEstimationInfoAsync } from '../../services/gas_price_estimation';
import { LocalStorage } from '../../services/local_storage';
import { tokenToTokenBalance } from '../../services/tokens';
import { getWeb3WrapperOrThrow, reconnectWallet } from '../../services/web3_wrapper';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { buildOrderFilledNotification } from '../../util/notifications';
import { BlockchainState, GasInfo, Token, TokenBalance, Web3State } from '../../util/types';
import { fetchMarkets, setMarketTokens, updateMarketPriceEther } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import {
    getCurrencyPair,
    getEthAccount,
    getGasPriceInWei,
    getMarkets,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from '../selectors';
import { addNotifications, setHasUnreadNotifications, setNotifications } from '../ui/actions';

export const initializeBlockchainData = createAction('INITIALIZE_BLOCKCHAIN_DATA', resolve => {
    return (blockchainData: Partial<BlockchainState>) => resolve(blockchainData);
});

export const setEthAccount = createAction('SET_ETH_ACCOUNT', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction('SET_WEB3_STATE', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction('SET_TOKEN_BALANCES', resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setEthBalance = createAction('SET_ETH_BALANCE', resolve => {
    return (ethBalance: BigNumber) => resolve(ethBalance);
});

export const setWethBalance = createAction('SET_WETH_BALANCE', resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setWethTokenBalance = createAction('SET_WETH_TOKEN_BALANCE', resolve => {
    return (wethTokenBalance: TokenBalance | null) => resolve(wethTokenBalance);
});

export const setGasInfo = createAction('SET_GAS_INFO', resolve => {
    return (gasInfo: GasInfo) => resolve(gasInfo);
});

export const setNetworkId = createAction('SET_NETWORK_ID', resolve => {
    return (networkId: number) => resolve(networkId);
});

export const toggleTokenLock = (token: Token, isUnlocked: boolean) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const contractWrappers = await getContractWrappers();
        const web3Wrapper = await getWeb3WrapperOrThrow();

        let tx: string;
        if (isUnlocked) {
            tx = await contractWrappers.erc20Token.setProxyAllowanceAsync(
                token.address,
                ethAccount,
                new BigNumber('0'),
                {
                    ...TX_DEFAULTS,
                    gasPrice,
                },
            );
        } else {
            tx = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);
        }

        web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });

        return tx;
    };
};

export const updateTokenBalancesOnToggleTokenLock = (token: Token, isUnlocked: boolean) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        if (isWeth(token.symbol)) {
            const wethTokenBalance = getWethTokenBalance(state) as TokenBalance;
            dispatch(
                setWethTokenBalance({
                    ...wethTokenBalance,
                    isUnlocked: !isUnlocked,
                }),
            );
        } else {
            const tokenBalances = getTokenBalances(state);
            const updatedTokenBalances = tokenBalances.map(tokenBalance => {
                if (tokenBalance.token.address !== token.address) {
                    return tokenBalance;
                }

                return {
                    ...tokenBalance,
                    isUnlocked: !isUnlocked,
                };
            });

            dispatch(setTokenBalances(updatedTokenBalances));
        }
    };
};

export const updateWethBalance = (newWethBalance: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const wethTokenBalance = getWethTokenBalance(state);
        const wethBalance = getWethBalance(state);

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const wethAddress = getKnownTokens(networkId).getWethToken().address;

        const contractWrappers = await getContractWrappers();

        let tx: string;
        if (wethBalance.lessThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.depositAsync(
                wethAddress,
                newWethBalance.sub(wethBalance),
                ethAccount,
            );
        } else if (wethBalance.greaterThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.withdrawAsync(
                wethAddress,
                wethBalance.sub(newWethBalance),
                ethAccount,
                {
                    ...TX_DEFAULTS,
                    gasPrice,
                },
            );
        } else {
            return;
        }

        web3Wrapper.awaitTransactionSuccessAsync(tx).then(async () => {
            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
            dispatch(setEthBalance(ethBalance));

            const newWethTokenBalance = wethTokenBalance
                ? {
                      ...wethTokenBalance,
                      balance: newWethBalance,
                  }
                : null;

            dispatch(setWethTokenBalance(newWethTokenBalance));
        });

        return tx;
    };
};

export const updateGasInfo = () => {
    return async (dispatch: any) => {
        const fetchedGasInfo = await getGasEstimationInfoAsync();
        dispatch(setGasInfo(fetchedGasInfo));
    };
};

let fillEventsSubscription: string | null = null;
export const setConnectedUserNotifications = (ethAccount: string, networkId: number) => {
    return async (dispatch: any, getState: any) => {
        const knownTokens = getKnownTokens(networkId);
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setEthAccount(ethAccount));

        dispatch(setNotifications(localStorage.getNotifications(ethAccount, networkId)));
        dispatch(setHasUnreadNotifications(localStorage.getHasUnreadNotifications(ethAccount, networkId)));

        const state = getState();
        const web3Wrapper = await getWeb3WrapperOrThrow();
        const contractWrappers = await getContractWrappers();

        const blockNumber = await web3Wrapper.getBlockNumberAsync();

        const lastBlockChecked = localStorage.getLastBlockChecked(ethAccount, networkId);

        const fromBlock =
            lastBlockChecked !== null ? lastBlockChecked + 1 : Math.max(blockNumber - START_BLOCK_LIMIT, 1);

        const toBlock = blockNumber;

        const markets = getMarkets(state);

        const subscription = subscribeToFillEvents({
            exchange: contractWrappers.exchange,
            fromBlock,
            toBlock,
            ethAccount,
            fillEventCallback: async fillEvent => {
                if (!knownTokens.isValidFillEvent(fillEvent)) {
                    return;
                }

                const timestamp = await web3Wrapper.getBlockTimestampAsync(fillEvent.blockNumber || blockNumber);
                const notification = buildOrderFilledNotification(fillEvent, knownTokens, markets);
                dispatch(
                    addNotifications([
                        {
                            ...notification,
                            timestamp: new Date(timestamp * 1000),
                        },
                    ]),
                );
            },
            pastFillEventsCallback: async fillEvents => {
                const validFillEvents = fillEvents.filter(knownTokens.isValidFillEvent);

                const notifications = await Promise.all(
                    validFillEvents.map(async fillEvent => {
                        const timestamp = await web3Wrapper.getBlockTimestampAsync(
                            fillEvent.blockNumber || blockNumber,
                        );
                        const notification = buildOrderFilledNotification(fillEvent, knownTokens, markets);

                        return {
                            ...notification,
                            timestamp: new Date(timestamp * 1000),
                        };
                    }),
                );

                dispatch(addNotifications(notifications));
            },
        });

        if (fillEventsSubscription) {
            contractWrappers.exchange.unsubscribe(fillEventsSubscription);
        }
        fillEventsSubscription = subscription;

        localStorage.saveLastBlockChecked(blockNumber, ethAccount, networkId);
    };
};

export const initWallet = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const currencyPair = getCurrencyPair(state);

        dispatch(setWeb3State(Web3State.Loading));
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const tokenBalances = await Promise.all(
                knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
            );

            const wethToken = knownTokens.getWethToken();

            const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);

            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setEthAccount(ethAccount));
            dispatch(
                initializeBlockchainData({
                    web3State: Web3State.Done,
                    ethBalance,
                    wethTokenBalance,
                    tokenBalances,
                    networkId,
                }),
            );
            dispatch(
                initializeRelayerData({
                    orders: [],
                    userOrders: [],
                }),
            );
            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(getOrderbookAndUserOrders());
            await dispatch(fetchMarkets());
            // For executing this method is necessary that the setMarkets method is already dispatched, otherwise it wont work (redux-thunk problem), so it's need to be dispatched here
            dispatch(setConnectedUserNotifications(ethAccount, networkId));
            dispatch(updateMarketPriceEther());
        } catch (error) {
            const knownTokens = getKnownTokens(MAINNET_ID);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            switch (error.message) {
                case METAMASK_USER_DENIED_AUTH: {
                    dispatch(setWeb3State(Web3State.Locked));
                    dispatch(
                        initializeRelayerData({
                            orders: [],
                            userOrders: [],
                        }),
                    );
                    dispatch(setMarketTokens({ baseToken, quoteToken }));
                    dispatch(getOrderBook());
                    dispatch(updateMarketPriceEther());
                    break;
                }
                case METAMASK_NOT_INSTALLED: {
                    dispatch(setWeb3State(Web3State.NotInstalled));
                    dispatch(
                        initializeRelayerData({
                            orders: [],
                            userOrders: [],
                        }),
                    );
                    dispatch(setMarketTokens({ baseToken, quoteToken }));
                    dispatch(getOrderBook());
                    dispatch(updateMarketPriceEther());
                    break;
                }
                default: {
                    dispatch(setWeb3State(Web3State.Error));
                    break;
                }
            }
        }
    };
};

export const unlockToken = (token: Token) => {
    return async (dispatch: any): Promise<any> => {
        return dispatch(toggleTokenLock(token, false));
    };
};

export const lockToken = (token: Token) => {
    return async (dispatch: any): Promise<any> => {
        return dispatch(toggleTokenLock(token, true));
    };
};

export const connectWallet = () => {
    return async (dispatch: any) => {
        await reconnectWallet();
        dispatch(initWallet());
    };
};
