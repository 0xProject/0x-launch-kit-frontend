import { BigNumber, SignedOrder } from '0x.js';
import { createAction } from 'typesafe-actions';

import { AFFILIATE_FEE_PERCENTAGE, FEE_RECIPIENT } from '../../common/constants';
import { INSUFFICIENT_ORDERS_TO_FILL_AMOUNT_ERR } from '../../exceptions/common';
import { InsufficientOrdersAmountException } from '../../exceptions/insufficient_orders_amount_exception';
import { RelayerException } from '../../exceptions/relayer_exception';
import {
    cancelSignedOrder,
    getAllOrdersAsUIOrders,
    getAllOrdersAsUIOrdersWithoutOrdersInfo,
    getUserIEOOrdersAsUIOrders,
    getUserOrdersAsUIOrders,
} from '../../services/orders';
import {
    getAccountMarketStatsFromRelayer,
    getAllIEOSignedOrders,
    getRelayer,
    postIEOSignedOrder,
} from '../../services/relayer';
import { isWeth } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import {
    buildLimitOrder,
    buildMarketLimitMatchingOrders,
    buildMarketOrders,
    sumTakerAssetFillableOrders,
} from '../../util/orders';
import { getTransactionOptions } from '../../util/transactions';
import {
    AccountMarketStat,
    NotificationKind,
    OrderSide,
    RelayerState,
    ThunkCreator,
    Token,
    TokenBalance,
    UIOrder,
    Web3State,
} from '../../util/types';
import { fetchBaseTokenIEO, updateTokenBalances } from '../blockchain/actions';
import { getAllCollectibles } from '../collectibles/actions';
import {
    getBaseToken,
    getBaseTokenIEO,
    getEthAccount,
    getEthBalance,
    getGasPriceInWei,
    getOpenBuyOrders,
    getOpenSellOrders,
    getQuoteToken,
    getWeb3State,
    getWethTokenBalance,
} from '../selectors';
import { addNotifications } from '../ui/actions';

const logger = getLogger('Store::Market::Actions');

export const initializeRelayerData = createAction('relayer/init', resolve => {
    return (relayerData: RelayerState) => resolve(relayerData);
});

export const setOrders = createAction('relayer/ORDERS_set', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction('relayer/USER_ORDERS_set', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserIEOOrders = createAction('relayer/USER_ORDERS_IEO_set', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setTokenIEOOrders = createAction('relayer/TOKEN_IEO_ORDERS_set', resolve => {
    return (orders: SignedOrder[]) => resolve(orders);
});

export const setAccountMarketStats = createAction('relayer/ACCOUNT_MARKET_STATS_set', resolve => {
    return (accountMarketStats: AccountMarketStat[]) => resolve(accountMarketStats);
});

export const getAllOrders: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const web3State = getWeb3State(state) as Web3State;
        try {
            let uiOrders: UIOrder[] = [];
            const isWeb3NotDoneState = [
                Web3State.Locked,
                Web3State.NotInstalled,
                Web3State.Error,
                Web3State.Connecting,
                Web3State.Connect,
            ].includes(web3State);
            // tslint:disable-next-line:prefer-conditional-expression
            if (isWeb3NotDoneState) {
                uiOrders = await getAllOrdersAsUIOrdersWithoutOrdersInfo(baseToken, quoteToken);
            } else {
                uiOrders = await getAllOrdersAsUIOrders(baseToken, quoteToken);
            }
            dispatch(setOrders(uiOrders));
        } catch (err) {
            logger.error(`getAllOrders: fetch orders from the relayer failed.`, err);
        }
    };
};

export const fetchAccountMarketStats: ThunkCreator = (market, from, to) => {
    return async (dispatch, _getState) => {
        try {
            const accountMarketStats: AccountMarketStat[] = await getAccountMarketStatsFromRelayer(market, from, to);
            dispatch(setAccountMarketStats(accountMarketStats));
        } catch (err) {
            logger.error(`get Market Account Stats: fetch account stats from the relayer failed.`, err);
        }
    };
};

export const fetchAllIEOOrders: ThunkCreator = () => {
    return async (dispatch, _getState) => {
        try {
            const IEOOrders: SignedOrder[] = await getAllIEOSignedOrders();
            dispatch(setTokenIEOOrders(IEOOrders));
        } catch (err) {
            logger.error(`get IEO orders from relayer failed.`, err);
        }
    };
};

export const fetchUserIEOOrders: ThunkCreator = (ethAccount, baseToken, quoteToken) => {
    return async (dispatch, _getState) => {
        try {
            const IEOOrders = await getUserIEOOrdersAsUIOrders(baseToken, quoteToken, ethAccount);
            dispatch(setUserIEOOrders(IEOOrders));
        } catch (err) {
            logger.error(`get IEO orders from relayer failed.`, err);
        }
    };
};

export const getUserOrders: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const ethAccount = getEthAccount(state);
        const web3State = getWeb3State(state) as Web3State;

        try {
            const isWeb3DoneState = web3State === Web3State.Done;
            // tslint:disable-next-line:prefer-conditional-expression
            if (isWeb3DoneState) {
                const myUIOrders = await getUserOrdersAsUIOrders(baseToken, quoteToken, ethAccount);
                dispatch(setUserOrders(myUIOrders));
            }
        } catch (err) {
            logger.error(`getUserOrders: fetch orders from the relayer failed.`, err);
        }
    };
};

export const cancelOrder: ThunkCreator = (order: UIOrder) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const gasPrice = getGasPriceInWei(state);

        const tx = cancelSignedOrder(order.rawOrder, gasPrice);

        // tslint:disable-next-line:no-floating-promises no-unsafe-any
        tx.then(transaction => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());

            dispatch(
                addNotifications([
                    {
                        id: transaction.transactionHash,
                        kind: NotificationKind.CancelOrder,
                        amount: order.size,
                        token: baseToken,
                        timestamp: new Date(),
                        tx,
                    },
                ]),
            );
        });
    };
};

export const submitCollectibleOrder: ThunkCreator = (signedOrder: SignedOrder) => {
    return async dispatch => {
        try {
            const submitResult = await getRelayer().submitOrderAsync(signedOrder);
            // tslint:disable-next-line:no-floating-promises
            dispatch(getAllCollectibles());
            // TODO: Dispatch notification
            return submitResult;
        } catch (error) {
            throw new RelayerException(error.message);
        }
    };
};

export const submitLimitOrder: ThunkCreator = (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        try {
            const submitResult = await getRelayer().submitOrderAsync(signedOrder);
            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());
            dispatch(
                addNotifications([
                    {
                        id: signedOrder.signature,
                        kind: NotificationKind.Limit,
                        amount,
                        token: baseToken,
                        side,
                        timestamp: new Date(),
                    },
                ]),
            );

            return submitResult;
        } catch (error) {
            throw new RelayerException(error.message);
        }
    };
};

export const submitLimitOrderIEO: ThunkCreator = (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseTokenIEO(state) as Token;
        try {
            const submitResult = await postIEOSignedOrder(signedOrder);
            // tslint:disable-next-line:no-floating-promises
            dispatch(fetchBaseTokenIEO(baseToken));
            dispatch(
                addNotifications([
                    {
                        id: signedOrder.signature,
                        kind: NotificationKind.Limit,
                        amount,
                        token: baseToken,
                        side,
                        timestamp: new Date(),
                    },
                ]),
            );

            return submitResult;
        } catch (error) {
            throw new RelayerException(error.message);
        }
    };
};

export const submitLimitMatchingOrder: ThunkCreator = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const isBuy = side === OrderSide.Buy;
        const allOrders = isBuy ? getOpenSellOrders(state) : getOpenBuyOrders(state);

        const { orders, amounts, remainingAmount } = buildMarketLimitMatchingOrders(
            {
                amount,
                price,
                orders: allOrders,
            },
            side,
        );

        if (orders.length > 0) {
            const quoteToken = getQuoteToken(state) as Token;
            const contractWrappers = await getContractWrappers();

            // Check if the order is fillable using the forwarder
            const ethBalance = getEthBalance(state) as BigNumber;
            let ethAmountRequired = amounts.reduce((total: BigNumber, currentValue: BigNumber) => {
                return total.plus(currentValue);
            }, new BigNumber(0));

            ethAmountRequired = ethAmountRequired.plus(
                ethAmountRequired.times(new BigNumber(AFFILIATE_FEE_PERCENTAGE)).toFixed(0),
            );

            const isEthBalanceEnough = ethBalance.isGreaterThan(ethAmountRequired);
            const isMarketBuyForwarder = isBuy && isWeth(quoteToken.symbol) && isEthBalanceEnough;

            let txHash = '';
            if (isMarketBuyForwarder) {
                txHash = await contractWrappers.forwarder.marketBuyOrdersWithEthAsync(
                    orders,
                    amount,
                    ethAccount,
                    ethAmountRequired,
                    [],
                    AFFILIATE_FEE_PERCENTAGE,
                    FEE_RECIPIENT,
                    getTransactionOptions(gasPrice),
                );
            } else {
                if (isBuy) {
                    txHash = await contractWrappers.exchange.marketBuyOrdersAsync(
                        orders,
                        amount,
                        ethAccount,
                        getTransactionOptions(gasPrice),
                    );
                } else {
                    txHash = await contractWrappers.exchange.marketSellOrdersAsync(
                        orders,
                        amount,
                        ethAccount,
                        getTransactionOptions(gasPrice),
                    );
                }
            }
            const web3Wrapper = await getWeb3Wrapper();
            const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);
            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalances());
            dispatch(
                addNotifications([
                    {
                        id: txHash,
                        kind: NotificationKind.Market,
                        amount,
                        token: baseToken,
                        side,
                        tx,
                        timestamp: new Date(),
                    },
                ]),
            );
            const amountInReturn = sumTakerAssetFillableOrders(side, orders, amounts);
            return { txHash, amountInReturn };
        } else {
            return { remainingAmount };
        }
    };
};

export const submitMarketOrder: ThunkCreator<Promise<{ txHash: string; amountInReturn: BigNumber }>> = (
    amount: BigNumber,
    side: OrderSide,
) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const isBuy = side === OrderSide.Buy;
        const allOrders = isBuy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
        const { orders, amounts, canBeFilled } = buildMarketOrders(
            {
                amount,
                orders: allOrders,
            },
            side,
        );

        if (canBeFilled) {
            const baseToken = getBaseToken(state) as Token;
            const quoteToken = getQuoteToken(state) as Token;
            const contractWrappers = await getContractWrappers();

            // Check if the order is fillable using the forwarder
            const ethBalance = getEthBalance(state) as BigNumber;
            let ethAmountRequired = amounts.reduce((total: BigNumber, currentValue: BigNumber) => {
                return total.plus(currentValue);
            }, new BigNumber(0));

            ethAmountRequired = ethAmountRequired.plus(
                ethAmountRequired.times(new BigNumber(AFFILIATE_FEE_PERCENTAGE)).toFixed(0),
            );

            const isEthBalanceEnough = ethBalance.isGreaterThan(ethAmountRequired);
            const isMarketBuyForwarder = isBuy && isWeth(quoteToken.symbol) && isEthBalanceEnough;

            let txHash;

            if (isMarketBuyForwarder) {
                txHash = await contractWrappers.forwarder.marketBuyOrdersWithEthAsync(
                    orders,
                    amount,
                    ethAccount,
                    ethAmountRequired,
                    [],
                    AFFILIATE_FEE_PERCENTAGE,
                    FEE_RECIPIENT,
                    getTransactionOptions(gasPrice),
                );
            } else {
                if (isBuy) {
                    txHash = await contractWrappers.exchange.marketBuyOrdersAsync(
                        orders,
                        amount,
                        ethAccount,
                        getTransactionOptions(gasPrice),
                    );
                } else {
                    txHash = await contractWrappers.exchange.marketSellOrdersAsync(
                        orders,
                        amount,
                        ethAccount,
                        getTransactionOptions(gasPrice),
                    );
                }
            }

            const web3Wrapper = await getWeb3Wrapper();
            const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

            // tslint:disable-next-line:no-floating-promises
            dispatch(getOrderbookAndUserOrders());
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalances());
            dispatch(
                addNotifications([
                    {
                        id: txHash,
                        kind: NotificationKind.Market,
                        amount,
                        token: baseToken,
                        side,
                        tx,
                        timestamp: new Date(),
                    },
                ]),
            );

            const amountInReturn = sumTakerAssetFillableOrders(side, orders, amounts);

            return { txHash, amountInReturn };
        } else {
            window.alert(INSUFFICIENT_ORDERS_TO_FILL_AMOUNT_ERR);
            throw new InsufficientOrdersAmountException();
        }
    };
};

export const getOrderbookAndUserOrders: ThunkCreator = () => {
    return async dispatch => {
        // tslint:disable-next-line:no-floating-promises
        dispatch(getAllOrders());
        // tslint:disable-next-line:no-floating-promises
        dispatch(getUserOrders());
    };
};

export const getOrderBook: ThunkCreator = () => {
    return async dispatch => {
        return dispatch(getAllOrders());
    };
};

export const fetchTakerAndMakerFee: ThunkCreator<Promise<{ makerFee: BigNumber; takerFee: BigNumber }>> = (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const contractWrappers = await getContractWrappers();

        const order = await buildLimitOrder(
            {
                account: ethAccount,
                amount,
                price,
                baseTokenAddress: baseToken.address,
                quoteTokenAddress: quoteToken.address,
                exchangeAddress: contractWrappers.exchange.address,
            },
            side,
        );

        const { makerFee, takerFee } = order;

        return {
            makerFee,
            takerFee,
        };
    };
};

export const fetchTakerAndMakerFeeIEO: ThunkCreator<Promise<{ makerFee: BigNumber; takerFee: BigNumber }>> = (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
) => {
    return async (dispatch, getState, { getContractWrappers }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const baseToken = getBaseTokenIEO(state) as Token;
        const quoteTokenBalance = getWethTokenBalance(state) as TokenBalance;
        const quoteToken = quoteTokenBalance.token;
        const contractWrappers = await getContractWrappers();

        const order = await buildLimitOrder(
            {
                account: ethAccount,
                amount,
                price,
                baseTokenAddress: baseToken.address,
                quoteTokenAddress: quoteToken.address,
                exchangeAddress: contractWrappers.exchange.address,
            },
            side,
        );

        const { makerFee, takerFee } = order;

        return {
            makerFee,
            takerFee,
        };
    };
    // tslint:disable-next-line: max-file-line-count
};
