// tslint:disable:max-file-line-count
import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction, createAsyncAction } from 'typesafe-actions';

import { COLLECTIBLE_ADDRESS, FEE_RECIPIENT, NETWORK_ID, START_BLOCK_LIMIT } from '../../common/constants';
import { ConvertBalanceMustNotBeEqualException } from '../../exceptions/convert_balance_must_not_be_equal_exception';

import { SignedOrderException } from '../../exceptions/signed_order_exception';
import { subscribeToFillEvents, subscribeToFillEventsByFeeRecipient } from '../../services/exchange';
import { getGasEstimationInfoAsync } from '../../services/gas_price_estimation';
import { LocalStorage } from '../../services/local_storage';
import { tokensToTokenBalances, tokenToTokenBalance } from '../../services/tokens';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { buildFill } from '../../util/fills';
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
import { fetchMarkets, setMarketTokens, updateMarketPriceEther, updateMarketPriceQuote } from '../market/actions';
import { getOrderBook, getOrderbookAndUserOrders, initializeRelayerData } from '../relayer/actions';
import {
    getCurrencyPair,
    getCurrentMarketPlace,
    getEthAccount,
    getGasPriceInWei,
    getMarkets,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from '../selectors';
import { addFills, addNotifications, setFills, setHasUnreadNotifications, setNotifications } from '../ui/actions';

const logger = getLogger('Blockchain::Actions');

export const convertBalanceStateAsync = createAsyncAction(
    'blockchain/CONVERT_BALANCE_STATE_fetch_request',
    'blockchain/CONVERT_BALANCE_STATE_fetch_success',
    'blockchain/CONVERT_BALANCE_STATE_fetch_failure',
)<void, void, void>();

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
    return async (dispatch, getState, { getContractWrappers }) => {
        const contractWrappers = await getContractWrappers();
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const wethBalance = getWethBalance(state);
        const wethAddress = getKnownTokens().getWethToken().address;

        let txHash: string;
        if (wethBalance.isLessThan(newWethBalance)) {
            txHash = await contractWrappers.etherToken.depositAsync(
                wethAddress,
                newWethBalance.minus(wethBalance),
                ethAccount,
                getTransactionOptions(gasPrice),
            );
        } else if (wethBalance.isGreaterThan(newWethBalance)) {
            txHash = await contractWrappers.etherToken.withdrawAsync(
                wethAddress,
                wethBalance.minus(newWethBalance),
                ethAccount,
                getTransactionOptions(gasPrice),
            );
        } else {
            throw new ConvertBalanceMustNotBeEqualException(wethBalance, newWethBalance);
        }

        return txHash;
    };
};

export const updateTokenBalances: ThunkCreator<Promise<any>> = (txHash?: string) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const knownTokens = getKnownTokens();
        const wethToken = knownTokens.getWethToken();

        const allTokenBalances = await tokensToTokenBalances([...knownTokens.getTokens(), wethToken], ethAccount);
        const wethBalance = allTokenBalances.find(b => b.token.symbol === wethToken.symbol);
        const tokenBalances = allTokenBalances.filter(b => b.token.symbol !== wethToken.symbol);
        dispatch(setTokenBalances(tokenBalances));

        const web3Wrapper = await getWeb3Wrapper();
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
        if (wethBalance) {
            dispatch(setWethBalance(wethBalance.balance));
        }
        dispatch(setEthBalance(ethBalance));
        return ethBalance;
    };
};

export const updateGasInfo: ThunkCreator = () => {
    return async dispatch => {
        const fetchedGasInfo = await getGasEstimationInfoAsync();
        dispatch(setGasInfo(fetchedGasInfo));
    };
};

let fillEventsSubscription: string | null = null;
export const setConnectedUserNotifications: ThunkCreator<Promise<any>> = (ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const knownTokens = getKnownTokens();
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setEthAccount(ethAccount));

        dispatch(setNotifications(localStorage.getNotifications(ethAccount)));
        dispatch(setHasUnreadNotifications(localStorage.getHasUnreadNotifications(ethAccount)));

        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
        const contractWrappers = await getContractWrappers();

        const blockNumber = await web3Wrapper.getBlockNumberAsync();

        const lastBlockChecked = localStorage.getLastBlockChecked(ethAccount);

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

        localStorage.saveLastBlockChecked(blockNumber, ethAccount);
    };
};

export const setConnectedDexFills: ThunkCreator<Promise<any>> = (ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const knownTokens = getKnownTokens();
        const localStorage = new LocalStorage(window.localStorage);

        dispatch(setFills(localStorage.getFills(ethAccount)));

        const state = getState();
        const web3Wrapper = await getWeb3Wrapper();
        const contractWrappers = await getContractWrappers();

        const blockNumber = await web3Wrapper.getBlockNumberAsync();

        const lastBlockChecked = localStorage.getLastBlockChecked(ethAccount);

        const fromBlock =lastBlockChecked !== null ? lastBlockChecked + 1 : Math.max(blockNumber - START_BLOCK_LIMIT, 1);
       

        const toBlock = blockNumber;

        const markets = getMarkets(state);

        const subscription = subscribeToFillEventsByFeeRecipient({
            exchange: contractWrappers.exchange,
            fromBlock,
            toBlock,
            ethAccount,
            fillEventCallback: async fillEvent => {
                if (!knownTokens.isValidFillEvent(fillEvent)) {
                    return;
                }
                const timestamp = await web3Wrapper.getBlockTimestampAsync(fillEvent.blockNumber || blockNumber);
                const fill = buildFill(fillEvent, knownTokens, markets);
                dispatch(
                    addFills([
                        {
                            ...fill,
                            timestamp: new Date(timestamp * 1000),
                        },
                    ]),
                );
            },
            pastFillEventsCallback: async fillEvents => {

                const validFillEvents = fillEvents.filter(knownTokens.isValidFillEvent);
                const fills = await Promise.all(
                    validFillEvents.map(async fillEvent => {
                        const timestamp = await web3Wrapper.getBlockTimestampAsync(
                            fillEvent.blockNumber || blockNumber,
                        );
                        const fill = buildFill(fillEvent, knownTokens, markets);

                        return {
                            ...fill,
                            timestamp: new Date(timestamp * 1000),
                        };
                    }),
                );

                dispatch(addFills(fills));
            },
        });

        if (fillEventsSubscription) {
            contractWrappers.exchange.unsubscribe(fillEventsSubscription);
        }
        fillEventsSubscription = subscription;

        localStorage.saveLastBlockChecked(blockNumber, ethAccount);
    };
};




export const initWallet: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
        dispatch(setWeb3State(Web3State.Loading));
        const state = getState();
        const currentMarketPlace = getCurrentMarketPlace(state);

        try {
            await dispatch(initWalletBeginCommon());

            if (currentMarketPlace === MARKETPLACES.ERC20) {
                // tslint:disable-next-line:no-floating-promises
                dispatch(initWalletERC20());
            } else {
                // tslint:disable-next-line:no-floating-promises
                dispatch(initWalletERC721());
            }
        } catch (error) {
            // Web3Error
            logger.error('There was an error when initializing the wallet', error);
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};

const initWalletBeginCommon: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { initializeWeb3Wrapper }) => {
        const web3Wrapper = await initializeWeb3Wrapper();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const knownTokens = getKnownTokens();
            const wethToken = knownTokens.getWethToken();
            const wethTokenBalance = await tokenToTokenBalance(wethToken, ethAccount);
            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

            await dispatch(
                initializeBlockchainData({
                    ethAccount,
                    web3State: Web3State.Done,
                    ethBalance,
                    wethTokenBalance,
                    tokenBalances: [],
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

            const networkId = await web3Wrapper.getNetworkIdAsync();
            if (networkId !== NETWORK_ID) {
                dispatch(setWeb3State(Web3State.Error));
            }
        }
    };
};

const initWalletERC20: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        if (!web3Wrapper) {
            // tslint:disable-next-line:no-floating-promises
            dispatch(initializeAppNoMetamaskOrLocked());

            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderBook());
        } else {
            const state = getState();
            const knownTokens = getKnownTokens();
            const ethAccount = getEthAccount(state);
            const tokenBalances = await tokensToTokenBalances(knownTokens.getTokens(), ethAccount);

            const currencyPair = getCurrencyPair(state);
            const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
            const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

            dispatch(setMarketTokens({ baseToken, quoteToken }));
            dispatch(setTokenBalances(tokenBalances));

            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());

            try {
                await dispatch(fetchMarkets());
                // For executing this method (setConnectedUserNotifications) is necessary that the setMarkets method is already dispatched, otherwise it wont work (redux-thunk problem), so it's need to be dispatched here
                // tslint:disable-next-line:no-floating-promises
                dispatch(setConnectedUserNotifications(ethAccount));
                // tslint:disable-next-line:no-floating-promises
                dispatch(setConnectedDexFills(FEE_RECIPIENT));
            } catch (error) {
                // Relayer error
                logger.error('The fetch markets from the relayer failed', error);
            }
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateMarketPriceQuote());
        }
    };
};

const initWalletERC721: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        if (web3Wrapper) {
            const state = getState();
            const ethAccount = getEthAccount(state);
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles(ethAccount));
        } else {
            // tslint:disable-next-line:no-floating-promises
            dispatch(initializeAppNoMetamaskOrLocked());

            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        }
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
        const collectibleId = new BigNumber(collectible.tokenId);
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const contractWrappers = await getContractWrappers();
            const wethAddress = getKnownTokens().getWethToken().address;
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
    };
};
/**
 *  Initializes the app with a default state if the user does not have metamask, with permissions rejected
 *  or if the user did not connected metamask to the dApp. Takes the info from the NETWORK_ID configured in the env vars
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
        const knownTokens = getKnownTokens();
        const baseToken = knownTokens.getTokenBySymbol(currencyPair.base);
        const quoteToken = knownTokens.getTokenBySymbol(currencyPair.quote);

        dispatch(
            initializeRelayerData({
                orders: [],
                userOrders: [],
            }),
        );

        // tslint:disable-next-line:no-floating-promises
        dispatch(setMarketTokens({ baseToken, quoteToken }));

        const currentMarketPlace = getCurrentMarketPlace(state);
        if (currentMarketPlace === MARKETPLACES.ERC20) {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderBook());

            // tslint:disable-next-line:no-floating-promises
            await dispatch(fetchMarkets());
             // tslint:disable-next-line: no-floating-promises
            dispatch(updateMarketPriceQuote());
        } else {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
        }

        // tslint:disable-next-line:no-floating-promises
        dispatch(updateMarketPriceEther());
   
    };
};
