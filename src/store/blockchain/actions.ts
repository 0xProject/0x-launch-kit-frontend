import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction } from 'typesafe-actions';

import { COLLECTIBLE_ADDRESS, MAINNET_ID, START_BLOCK_LIMIT } from '../../common/constants';
import { SignedOrderException } from '../../exceptions/signed_order_exception';
import { subscribeToFillEvents } from '../../services/exchange';
import { getGasEstimationInfoAsync } from '../../services/gas_price_estimation';
import { LocalStorage } from '../../services/local_storage';
import { tokenToTokenBalance } from '../../services/tokens';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { buildOrderFilledNotification } from '../../util/notifications';
import { buildDutchAuctionCollectibleOrder, buildSellCollectibleOrder } from '../../util/orders';
import { getTransactionOptions } from '../../util/transactions';
import {
    BlockchainState,
    Collectible,
    GasInfo,
    MARKETPLACES,
    OrderSide,
    ThunkCreator,
    Token,
    TokenBalance,
    Web3State,
} from '../../util/types';
import { getAllCollectibles } from '../collectibles/actions';
import { fetchMarkets, setMarketTokens, updateMarketPriceEther } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import {
    getCurrencyPair,
    getCurrentMarketPlace,
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
                getTransactionOptions(gasPrice),
            );
        } else {
            tx = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
                token.address,
                ethAccount,
                getTransactionOptions(gasPrice),
            );
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
        if (wethBalance.isLessThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.depositAsync(
                wethAddress,
                newWethBalance.minus(wethBalance),
                ethAccount,
                getTransactionOptions(gasPrice),
            );
        } else if (wethBalance.isGreaterThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.withdrawAsync(
                wethAddress,
                wethBalance.minus(newWethBalance),
                ethAccount,
                getTransactionOptions(gasPrice),
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
        const state = getState();
        const currentMarketPlace = getCurrentMarketPlace(state);
        if (!web3Wrapper) {
            if (currentMarketPlace === MARKETPLACES.ERC20) {
                initializeAppNoMetamaskOrLocked();
            }
        } else {
            try {
                const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
                const networkId = await web3Wrapper.getNetworkIdAsync();

                const knownTokens = getKnownTokens(networkId);

                const wethToken = knownTokens.getWethToken();

                const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);

                const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

                dispatch(
                    initializeBlockchainData({
                        ethAccount,
                        web3State: Web3State.Done,
                        ethBalance,
                        wethTokenBalance,
                        tokenBalances: [],
                        networkId,
                    }),
                );
                dispatch(
                    initializeRelayerData({
                        orders: [],
                        userOrders: [],
                    }),
                );
                // tslint:disable-next-line:no-floating-promises
                dispatch(updateGasInfo());
                // tslint:disable-next-line:no-floating-promises
                dispatch(updateMarketPriceEther());
                // Inits wallet based on the current app
                if (currentMarketPlace === MARKETPLACES.ERC20) {
                    // tslint:disable-next-line:no-floating-promises
                    dispatch(initWalletERC20(ethAccount, networkId));
                } else {
                    // tslint:disable-next-line:no-floating-promises
                    dispatch(initWalletERC721(ethAccount));
                }
            } catch (error) {
                // Web3Error
                logger.error('There was an error fetching the account or networkId from web3', error);
                dispatch(setWeb3State(Web3State.Error));
            }
        }
    };
};

const initWalletERC20: ThunkCreator<Promise<any>> = (ethAccount: string, networkId: number) => {
    return async (dispatch, getState) => {
        const state = getState();
        const knownTokens = getKnownTokens(networkId);

        const tokenBalances = await Promise.all(
            knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
        );
        const currencyPair = getCurrencyPair(state);
        const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
        const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

        dispatch(setMarketTokens({ baseToken, quoteToken }));
        // tslint:disable-next-line:no-floating-promises
        dispatch(getOrderbookAndUserOrders());
        dispatch(setTokenBalances(tokenBalances));
        try {
            await dispatch(fetchMarkets());
            // For executing this method (setConnectedUserNotifications) is necessary that the setMarkets method is already dispatched, otherwise it wont work (redux-thunk problem), so it's need to be dispatched here
            // tslint:disable-next-line:no-floating-promises
            dispatch(setConnectedUserNotifications(ethAccount, networkId));
        } catch (error) {
            // Relayer error
            logger.error('The fetch orders from the relayer failed', error);
        }
    };
};

const initWalletERC721: ThunkCreator<Promise<any>> = (ethAccount: string) => {
    return async dispatch => {
        // tslint:disable-next-line:no-floating-promises
        dispatch(getAllCollectibles(ethAccount));
    };
};

export const unlockCollectible: ThunkCreator<Promise<string>> = (collectible: Collectible) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const state = getState();
        const contractWrappers = await getContractWrappers();
        const gasPrice = getGasPriceInWei(state);
        const ethAccount = getEthAccount(state);
        const defaultParams = getTransactionOptions(gasPrice);

        const tx = await contractWrappers.erc721Token.setProxyApprovalForAllAsync(
            COLLECTIBLE_ADDRESS,
            ethAccount,
            true,
            defaultParams,
        );
        return tx;
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
    side: OrderSide,
    startPrice: BigNumber,
    expirationDate: BigNumber,
    endPrice: BigNumber | null,
) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const networkId = getNetworkId(state);
        const collectibleId = new BigNumber(collectible.tokenId);
        if (networkId) {
            try {
                const web3Wrapper = await getWeb3Wrapper();
                const contractWrappers = await getContractWrappers();
                const wethAddress = getKnownTokens(networkId).getWethToken().address;
                const exchangeAddress = contractWrappers.exchange.address;
                let order;
                if (endPrice) {
                    // DutchAuction sell
                    const senderAddress = contractWrappers.dutchAuction.address;
                    order = await buildDutchAuctionCollectibleOrder({
                        account: ethAccount,
                        amount: new BigNumber('1'),
                        price: startPrice,
                        endPrice,
                        expirationDate,
                        wethAddress,
                        collectibleAddress: COLLECTIBLE_ADDRESS,
                        collectibleId,
                        exchangeAddress,
                        senderAddress,
                    });
                } else {
                    // Normal Sell
                    order = await buildSellCollectibleOrder(
                        {
                            account: ethAccount,
                            amount: new BigNumber('1'),
                            price: startPrice,
                            exchangeAddress,
                            expirationDate,
                            collectibleId,
                            collectibleAddress: COLLECTIBLE_ADDRESS,
                            wethAddress,
                        },
                        side,
                    );
                }

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
