import { BigNumber } from '0x.js';
import { createAction } from 'typesafe-actions';

import { MAINNET_ID, METAMASK_NOT_INSTALLED, METAMASK_USER_DENIED_AUTH, TX_DEFAULTS } from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { subscribeToFillEvents } from '../../services/exchange';
import { LocalStorage } from '../../services/local_storage';
import { tokenToTokenBalance } from '../../services/tokens';
import { getWeb3WrapperOrThrow, reconnectWallet } from '../../services/web3_wrapper';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { buildOrderFilledNotification } from '../../util/notifications';
import { BlockchainState, Token, TokenBalance, Web3State } from '../../util/types';
import { getMarkets, setMarketTokens, updateMarketPriceEther } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import { getCurrencyPair, getEthAccount, getTokenBalances, getWethBalance, getWethTokenBalance } from '../selectors';
import { addNotification, setHasUnreadNotifications, setNotifications } from '../ui/actions';

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

export const toggleTokenLock = (token: Token, isUnlocked: boolean) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);

        const contractWrappers = await getContractWrappers();

        let tx: string;
        if (isUnlocked) {
            tx = await contractWrappers.erc20Token.setProxyAllowanceAsync(
                token.address,
                ethAccount,
                new BigNumber('0'),
                TX_DEFAULTS,
            );
        } else {
            tx = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);
        }

        if (isWeth(token)) {
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

        return tx;
    };
};

export const updateWethBalance = (newWethBalance: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
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
                TX_DEFAULTS,
            );
        } else {
            return;
        }

        await web3Wrapper.awaitTransactionSuccessAsync(tx);
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
        dispatch(setEthBalance(ethBalance));

        const newWethTokenBalance = wethTokenBalance
            ? {
                  ...wethTokenBalance,
                  balance: newWethBalance,
              }
            : null;

        dispatch(setWethTokenBalance(newWethTokenBalance));
    };
};

let fillEventsSubscription: string | null = null;
export const setConnectedUser = (ethAccount: string, networkId: number) => {
    return async (dispatch: any) => {
        const knownTokens = getKnownTokens(networkId);
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setEthAccount(ethAccount));

        dispatch(setNotifications(localStorage.getNotifications(ethAccount)));
        dispatch(setHasUnreadNotifications(localStorage.getHasUnreadNotifications(ethAccount)));

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const contractWrappers = await getContractWrappers();

        const blockNumber = await web3Wrapper.getBlockNumberAsync();

        const fromBlock = localStorage.getLastBlockChecked(ethAccount) + 1;
        const toBlock = blockNumber;

        const subscription = await subscribeToFillEvents({
            exchange: contractWrappers.exchange,
            fromBlock,
            toBlock,
            ethAccount,
            fillEventCallback: async fillEvent => {
                const timestamp = await web3Wrapper.getBlockTimestampAsync(fillEvent.blockNumber || blockNumber);
                const notification = buildOrderFilledNotification(fillEvent, knownTokens);
                dispatch(
                    addNotification({
                        ...notification,
                        timestamp: new Date(timestamp * 1000),
                    }),
                );
            },
        });

        if (fillEventsSubscription) {
            contractWrappers.exchange.unsubscribe(fillEventsSubscription);
        }
        fillEventsSubscription = subscription;

        localStorage.saveLastBlockChecked(blockNumber, ethAccount);
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

            dispatch(setConnectedUser(ethAccount, networkId));
            dispatch(
                initializeBlockchainData({
                    web3State: Web3State.Done,
                    ethBalance,
                    wethTokenBalance,
                    tokenBalances,
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
            dispatch(getMarkets());
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

export const addWethToBalance = (amount: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);

        const wethToken = getKnownTokens().getWethToken();
        const wethAddress = wethToken.address;

        const contractWrappers = await getContractWrappers();
        return contractWrappers.etherToken.depositAsync(wethAddress, amount, ethAccount);
    };
};

export const unlockToken = (token: Token) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        return dispatch(toggleTokenLock(token, false));
    };
};

export const lockToken = (token: Token) => {
    return async (dispatch: any, getState: any): Promise<any> => {
        return dispatch(toggleTokenLock(token, true));
    };
};

export const connectWallet = () => {
    return async (dispatch: any) => {
        await reconnectWallet();
        dispatch(initWallet());
    };
};
