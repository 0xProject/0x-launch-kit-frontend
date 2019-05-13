import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction } from 'typesafe-actions';

import { MAINNET_ID, START_BLOCK_LIMIT, TX_DEFAULTS } from '../../common/constants';
import { SignedOrderException } from '../../exceptions/signed_order_exception';
import { getCollectibleContractAddress } from '../../services/collectibles_metadata_sources';
import { subscribeToFillEvents } from '../../services/exchange';
import { getGasEstimationInfoAsync } from '../../services/gas_price_estimation';
import { LocalStorage } from '../../services/local_storage';
import { tokenToTokenBalance } from '../../services/tokens';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { buildOrderFilledNotification } from '../../util/notifications';
import { buildSellCollectibleOrder } from '../../util/orders';
import {
    BlockchainState,
    Collectible,
    GasInfo,
    OrderSide,
    ThunkCreator,
    Token,
    TokenBalance,
    Web3State,
} from '../../util/types';
import { getUserCollectibles } from '../collectibles/actions';
import { fetchMarkets, setMarketTokens, updateMarketPriceEther } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import {
    getCurrencyPair,
    getEthAccount,
    getGasPriceInWei,
    getMarkets,
    getNetworkId,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from '../selectors';
import { addNotifications, setHasUnreadNotifications, setNotifications } from '../ui/actions';

const logger = getLogger('Blockchain::Actions');

export const initializeBlockchainData = createAction('blockchain/init', resolve => {
    return (blockchainData: Partial<BlockchainState>) => resolve(blockchainData);
});

export const setEthAccount = createAction('blockchain/ETH_ACCOUNT_set', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction('blockchain/WEB3_STATE_set', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction('blockchain/TOKEN_BALANCES_set', resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setEthBalance = createAction('blockchain/ETH_BALANCE_set', resolve => {
    return (ethBalance: BigNumber) => resolve(ethBalance);
});

export const setWethBalance = createAction('blockchain/WETH_BALANCE_set', resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setWethTokenBalance = createAction('blockchain/WETH_TOKEN_BALANCE_set', resolve => {
    return (wethTokenBalance: TokenBalance | null) => resolve(wethTokenBalance);
});

export const setGasInfo = createAction('blockchain/GAS_INFO_set', resolve => {
    return (gasInfo: GasInfo) => resolve(gasInfo);
});

export const setNetworkId = createAction('blockchain/NETWORK_ID_set', resolve => {
    return (networkId: number) => resolve(networkId);
});

export const toggleTokenLock: ThunkCreator<Promise<any>> = (token: Token, isUnlocked: boolean) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const contractWrappers = await getContractWrappers();
        const web3Wrapper = await getWeb3Wrapper();

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
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });

        return tx;
    };
};

export const updateTokenBalancesOnToggleTokenLock: ThunkCreator = (token: Token, isUnlocked: boolean) => {
    return async (dispatch, getState) => {
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

export const updateWethBalance: ThunkCreator<Promise<any>> = (newWethBalance: BigNumber) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const wethTokenBalance = getWethTokenBalance(state);
        const wethBalance = getWethBalance(state);

        const web3Wrapper = await getWeb3Wrapper();
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

export const updateGasInfo: ThunkCreator = () => {
    return async dispatch => {
        const fetchedGasInfo = await getGasEstimationInfoAsync();
        dispatch(setGasInfo(fetchedGasInfo));
    };
};

let fillEventsSubscription: string | null = null;
export const setConnectedUserNotifications: ThunkCreator<Promise<any>> = (ethAccount: string, networkId: number) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const knownTokens = getKnownTokens(networkId);
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setEthAccount(ethAccount));

        dispatch(setNotifications(localStorage.getNotifications(ethAccount, networkId)));
        dispatch(setHasUnreadNotifications(localStorage.getHasUnreadNotifications(ethAccount, networkId)));

        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
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

export const initWallet: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { initializeWeb3Wrapper }) => {
        dispatch(setWeb3State(Web3State.Loading));
        const web3Wrapper = await initializeWeb3Wrapper();
        if (!web3Wrapper) {
            initializeAppNoMetamaskOrLocked();
        } else {
            try {
                const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
                const networkId = await web3Wrapper.getNetworkIdAsync();

                const knownTokens = getKnownTokens(networkId);

                const tokenBalances = await Promise.all(
                    knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
                );

                const wethToken = knownTokens.getWethToken();

                const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);

                const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

                const state = getState();
                const currencyPair = getCurrencyPair(state);
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
                // tslint:disable-next-line:no-floating-promises
                dispatch(getOrderbookAndUserOrders());
                // tslint:disable-next-line:no-floating-promises
                dispatch(getUserCollectibles(ethAccount));
                try {
                    await dispatch(fetchMarkets());
                    // For executing this method is necessary that the setMarkets method is already dispatched, otherwise it wont work (redux-thunk problem), so it's need to be dispatched here
                    // tslint:disable-next-line:no-floating-promises
                    dispatch(setConnectedUserNotifications(ethAccount, networkId));
                    // tslint:disable-next-line:no-floating-promises
                    dispatch(updateMarketPriceEther());
                } catch (error) {
                    // Relayer error
                    logger.error('The fetch orders from the relayer failed', error);
                }
            } catch (error) {
                // Web3Error
                logger.error('There was an error fetching the account or networkId from web3', error);
                dispatch(setWeb3State(Web3State.Error));
            }
        }
    };
};

export const unlockCollectible: ThunkCreator = (collectible: Collectible) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const state = getState();
        const contractWrappers = await getContractWrappers();
        const gasPrice = getGasPriceInWei(state);
        const networkId = getNetworkId(state);
        const ethAccount = getEthAccount(state);
        const defaultParams = {
            ...TX_DEFAULTS,
            gasPrice,
        };
        const tokenId = new BigNumber(collectible.tokenId);

        if (networkId) {
            const collectibleContractAddress = getCollectibleContractAddress(networkId);

            // Check if needs to unlock TODO -- maybe we could just remove this because the check should be on the token steps generation
            const needUnlock = await contractWrappers.erc721Token.isProxyApprovedAsync(
                collectibleContractAddress,
                tokenId,
            );

            // Unlocks if needed
            if (needUnlock) {
                const tx = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
                    collectibleContractAddress,
                    ethAccount,
                    true,
                    defaultParams,
                );
                return tx;
            }
        }
        return null;
    };
};

export const unlockToken: ThunkCreator = (token: Token) => {
    return async dispatch => {
        return dispatch(toggleTokenLock(token, false));
    };
};

export const lockToken: ThunkCreator = (token: Token) => {
    return async dispatch => {
        return dispatch(toggleTokenLock(token, true));
    };
};

export const createSignedCollectibleOrder: ThunkCreator = (
    collectible: Collectible,
    price: BigNumber,
    side: OrderSide,
) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const networkId = getNetworkId(state);
        const amount = new BigNumber('1');
        const collectibleId = new BigNumber(collectible.tokenId);
        if (networkId) {
            try {
                const web3Wrapper = await getWeb3Wrapper();
                const contractWrappers = await getContractWrappers();
                const collectibleAddress = getCollectibleContractAddress(networkId);
                const order = buildSellCollectibleOrder(
                    {
                        account: ethAccount,
                        amount,
                        price,
                        exchangeAddress: contractWrappers.exchange.address,
                        collectibleId,
                        collectibleAddress,
                        wethAddress: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
                    },
                    side,
                );
                const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
                return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
            } catch (error) {
                throw new SignedOrderException(error.message);
            }
        }
    };
};
/**
 *  Initializes the app with a default state if the user does not have metamask, with permissions rejected
 *  or if the user did not connected metamask to the dApp. Takes the info from MAINNET
 */
export const initializeAppNoMetamaskOrLocked: ThunkCreator = () => {
    return async (dispatch, getState) => {
        if (isMetamaskInstalled()) {
            dispatch(setWeb3State(Web3State.Locked));
        } else {
            dispatch(setWeb3State(Web3State.NotInstalled));
        }
        const state = getState();
        const currencyPair = getCurrencyPair(state);
        const knownTokens = getKnownTokens(MAINNET_ID);
        const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
        const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

        dispatch(
            initializeRelayerData({
                orders: [],
                userOrders: [],
            }),
        );

        dispatch(setMarketTokens({ baseToken, quoteToken }));

        // tslint:disable-next-line:no-floating-promises
        dispatch(getOrderBook());

        // tslint:disable-next-line:no-floating-promises
        dispatch(updateMarketPriceEther());
    };
};
