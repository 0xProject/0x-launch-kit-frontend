import { SignedOrder } from '@0x/types';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { createAction } from 'typesafe-actions';

import { FEE_PERCENTAGE, FEE_RECIPIENT, ZERO } from '../../common/constants';
import { INSUFFICIENT_ORDERS_TO_FILL_AMOUNT_ERR } from '../../exceptions/common';
import { InsufficientOrdersAmountException } from '../../exceptions/insufficient_orders_amount_exception';
import { RelayerException } from '../../exceptions/relayer_exception';
import { postConfig } from '../../services/config';
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
    getFillsFromRelayer,
    getMarketFillsFromRelayer,
    getRelayer,
    postIEOSignedOrder,
    startWebsocketMarketsSubscription,
} from '../../services/relayer';
import { mapRelayerFillToFill } from '../../util/fills';
import { getKnownTokens, isWeth } from '../../util/known_tokens';
import { getLogger } from '../../util/logger';
import { marketToString } from '../../util/markets';
import {
    buildLimitOrder,
    buildLimitOrderIEO,
    buildMarketLimitMatchingOrders,
    buildMarketOrders,
    calculateWorstCaseProtocolFee,
    sumTakerAssetFillableOrders,
} from '../../util/orders';
import { getTransactionOptions } from '../../util/transactions';
import {
    AccountMarketStat,
    ConfigRelayerData,
    Fill,
    MarketFill,
    NotificationKind,
    OrderFeeData,
    OrderFilledMessage,
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
    getCurrencyPair,
    getEthAccount,
    getEthBalance,
    getFeeRecipient,
    getGasPriceInWei,
    getMakerAddresses,
    getOpenBuyOrders,
    getOpenSellOrders,
    getQuoteToken,
    getWeb3State,
    getWethTokenBalance,
} from '../selectors';
import { addFills, addMarketFills, addNotifications, setFills, setMarketFills } from '../ui/actions';

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

export const setFeeRecipient = createAction('relayer/FEE_RECIPIENT_set', resolve => {
    return (feeRecipient: string) => resolve(feeRecipient);
});

export const setFeePercentage = createAction('relayer/FEE_PERCENTAGE_set', resolve => {
    return (feePercentange: number) => resolve(feePercentange);
});

export const getAllOrders: ThunkCreator = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const web3State = getWeb3State(state) as Web3State;
        const makerAddresses = getMakerAddresses(state);
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
                uiOrders = await getAllOrdersAsUIOrdersWithoutOrdersInfo(baseToken, quoteToken, makerAddresses);
            } else {
                uiOrders = await getAllOrdersAsUIOrders(baseToken, quoteToken, makerAddresses);
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

        const { ordersToFill, amounts, remainingAmount } = buildMarketLimitMatchingOrders(
            {
                amount,
                price,
                orders: allOrders,
            },
            side,
        );

        if (ordersToFill.length > 0) {
            const contractWrappers = await getContractWrappers();
            const quoteToken = getQuoteToken(state) as Token;
            // Check if the order is fillable using the forwarder
            const ethBalance = getEthBalance(state) as BigNumber;
            const ethAmountRequired = amounts.reduce((total: BigNumber, currentValue: BigNumber) => {
                return total.plus(currentValue);
            }, ZERO);
            const protocolFee = calculateWorstCaseProtocolFee(ordersToFill, gasPrice);
            const feeAmount = ordersToFill.map(o => o.takerFee).reduce((p, c) => p.plus(c));
            const affiliateFeeAmount = ethAmountRequired
                .plus(protocolFee)
                .plus(feeAmount)
                .multipliedBy(FEE_PERCENTAGE)
                .integerValue(BigNumber.ROUND_CEIL);

            const totalEthAmount = ethAmountRequired
                .plus(protocolFee)
                .plus(affiliateFeeAmount)
                .plus(feeAmount);
            const isEthBalanceEnough = ethBalance.isGreaterThan(totalEthAmount);
            // HACK(dekz): Forwarder not currently deployed in Ganache
            const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
            const isMarketBuyForwarder =
                isBuy &&
                isWeth(quoteToken.symbol) &&
                isEthBalanceEnough &&
                contractWrappers.forwarder.address !== NULL_ADDRESS;
            const orderSignatures = ordersToFill.map(o => o.signature);

            let txHash;
            try {
                if (isMarketBuyForwarder) {
                    txHash = await contractWrappers.forwarder
                        .marketBuyOrdersWithEth(
                            ordersToFill,
                            amount,
                            orderSignatures,
                            Web3Wrapper.toBaseUnitAmount(FEE_PERCENTAGE, 18),
                            FEE_RECIPIENT,
                        )
                        .sendTransactionAsync({
                            from: ethAccount,
                            value: totalEthAmount,
                            ...getTransactionOptions(gasPrice),
                        });
                } else {
                    if (isBuy) {
                        txHash = await contractWrappers.exchange
                            .marketBuyOrdersFillOrKill(ordersToFill, amount, orderSignatures)
                            .sendTransactionAsync({
                                from: ethAccount,
                                value: protocolFee,
                                ...getTransactionOptions(gasPrice),
                            });
                    } else {
                        txHash = await contractWrappers.exchange
                            .marketSellOrdersFillOrKill(ordersToFill, amount, orderSignatures)
                            .sendTransactionAsync({
                                from: ethAccount,
                                value: protocolFee,
                                ...getTransactionOptions(gasPrice),
                            });
                    }
                }
            } catch (e) {
                logger.log(e.message);
                throw e;
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
            const amountInReturn = sumTakerAssetFillableOrders(side, ordersToFill, amounts);
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
        const feeRecipient = getFeeRecipient(state) || FEE_RECIPIENT;
        const feePercentange = Number(getFeeRecipient(state)) || FEE_PERCENTAGE;
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const isBuy = side === OrderSide.Buy;
        const orders = isBuy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
        const [ordersToFill, amounts, canBeFilled] = buildMarketOrders(
            {
                amount,
                orders,
            },
            side,
        );

        if (canBeFilled) {
            const baseToken = getBaseToken(state) as Token;
            const quoteToken = getQuoteToken(state) as Token;
            const contractWrappers = await getContractWrappers();

            // Check if the order is fillable using the forwarder
            const ethBalance = getEthBalance(state) as BigNumber;
            const ethAmountRequired = amounts.reduce((total: BigNumber, currentValue: BigNumber) => {
                return total.plus(currentValue);
            }, ZERO);
            const protocolFee = calculateWorstCaseProtocolFee(ordersToFill, gasPrice);
            const feeAmount = ordersToFill.map(o => o.takerFee).reduce((p, c) => p.plus(c));
            const affiliateFeeAmount = ethAmountRequired
                .plus(protocolFee)
                .plus(feeAmount)
                .multipliedBy(feePercentange)
                .integerValue(BigNumber.ROUND_CEIL);

            const totalEthAmount = ethAmountRequired
                .plus(protocolFee)
                .plus(affiliateFeeAmount)
                .plus(feeAmount);

            const isEthBalanceEnough = ethBalance.isGreaterThan(totalEthAmount);
            // HACK(dekz): Forwarder not currently deployed in Ganache
            const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
            const isMarketBuyForwarder =
                isBuy &&
                isWeth(quoteToken.symbol) &&
                isEthBalanceEnough &&
                contractWrappers.forwarder.address !== NULL_ADDRESS;
            const orderSignatures = ordersToFill.map(o => o.signature);

            let txHash;
            try {
                if (isMarketBuyForwarder) {
                    txHash = await contractWrappers.forwarder
                        .marketBuyOrdersWithEth(
                            ordersToFill,
                            amount,
                            orderSignatures,
                            Web3Wrapper.toBaseUnitAmount(feePercentange, 18),
                            feeRecipient,
                        )
                        .sendTransactionAsync({
                            from: ethAccount,
                            value: totalEthAmount,
                            ...getTransactionOptions(gasPrice),
                        });
                } else {
                    if (isBuy) {
                        txHash = await contractWrappers.exchange
                            .marketBuyOrdersFillOrKill(ordersToFill, amount, orderSignatures)
                            .sendTransactionAsync({
                                from: ethAccount,
                                value: protocolFee,
                                ...getTransactionOptions(gasPrice),
                            });
                    } else {
                        txHash = await contractWrappers.exchange
                            .marketSellOrdersFillOrKill(ordersToFill, amount, orderSignatures)
                            .sendTransactionAsync({
                                from: ethAccount,
                                value: protocolFee,
                                ...getTransactionOptions(gasPrice),
                            });
                    }
                }
            } catch (e) {
                logger.log(e.message);
                throw e;
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

            const amountInReturn = sumTakerAssetFillableOrders(side, ordersToFill, amounts);

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

export const fetchTakerAndMakerFee: ThunkCreator<Promise<OrderFeeData>> = (
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

        const { makerFee, takerFee, makerFeeAssetData, takerFeeAssetData } = order;

        return {
            makerFee,
            takerFee,
            makerFeeAssetData,
            takerFeeAssetData,
        };
    };
};

export const subscribeToRelayerWebsocketFillEvents: ThunkCreator<Promise<void>> = () => {
    return async (dispatch, _getState) => {
        const onmessage = (ev: any) => {
            try {
                const fillMessage = JSON.parse(ev.data) as OrderFilledMessage;
                if (fillMessage.action === 'FILL') {
                    const fill = fillMessage.event;
                    const known_tokens = getKnownTokens();
                    if (
                        known_tokens.isKnownAddress(fill.quoteTokenAddress) &&
                        known_tokens.isKnownAddress(fill.baseTokenAddress)
                    ) {
                        const newFill: Fill = {
                            id: fill.id,
                            amountQuote: new BigNumber(fill.filledQuoteTokenAmount),
                            amountBase: new BigNumber(fill.filledBaseTokenAmount),
                            tokenQuote: known_tokens.getTokenByAddress(fill.quoteTokenAddress),
                            tokenBase: known_tokens.getTokenByAddress(fill.baseTokenAddress),
                            side: fill.type === 'BUY' ? OrderSide.Buy : OrderSide.Sell,
                            price: fill.price,
                            timestamp: new Date(fill.timestamp),
                            makerAddress: fill.makerAddress,
                            takerAddress: fill.takerAddress,
                            market: fill.pair,
                        };
                        dispatch(addFills([newFill]));
                        dispatch(
                            addMarketFills({
                                [fill.pair]: [newFill],
                            }),
                        );
                    }
                }
            } catch (error) {
                logger.error('Failed to subscribe websocket relayer', error);
            }
        };

        try {
            startWebsocketMarketsSubscription(onmessage);
        } catch (error) {
            logger.error('Failed to subscribe websocket relayer', error);
        }
    };
};

export const fetchPastFills: ThunkCreator<Promise<void>> = () => {
    return async (dispatch, getState) => {
        const state = getState();
        /*const knownTokens = getKnownTokens();
        const ethAccount = FEE_RECIPIENT;
        const localStorage = new LocalStorage(window.localStorage);
        const storageFills = localStorage.getFills(ethAccount).filter(f => {
            return knownTokens.isKnownAddress(f.tokenBase.address) && knownTokens.isKnownAddress(f.tokenQuote.address);
        });
        dispatch(setFills(storageFills));
        dispatch(setMarketFills(localStorage.getMarketFills(ethAccount)));*/

        try {
            const fillsResponse = await getFillsFromRelayer();
            const currencyPair = getCurrencyPair(state);
            const market = marketToString(currencyPair);
            const marketFillsResponse = await getMarketFillsFromRelayer(market);
            const known_tokens = getKnownTokens();
            if (fillsResponse) {
                const fills = fillsResponse.records;
                if (fills.length > 0) {
                    const filteredFills = fills
                        .filter(
                            f =>
                                known_tokens.isKnownAddress(f.tokenQuoteAddress) &&
                                known_tokens.isKnownAddress(f.tokenBaseAddress),
                        )
                        .map(mapRelayerFillToFill);
                    if (filteredFills && filteredFills.length > 0) {
                        dispatch(setFills(filteredFills));
                    }
                }
            }
            if (marketFillsResponse) {
                const fills = marketFillsResponse.records;
                if (fills.length > 0) {
                    const filteredFills = fills
                        .filter(
                            f =>
                                known_tokens.isKnownAddress(f.tokenQuoteAddress) &&
                                known_tokens.isKnownAddress(f.tokenBaseAddress),
                        )
                        .map(mapRelayerFillToFill);
                    if (filteredFills && filteredFills.length > 0) {
                        const marketsFill: MarketFill = {};
                        filteredFills.forEach(f => {
                            if (marketsFill[f.market]) {
                                marketsFill[f.market].push(f);
                            } else {
                                marketsFill[f.market] = [f];
                            }
                        });
                        dispatch(setMarketFills(marketsFill));
                    }
                }
            }
        } catch (error) {
            logger.error('Failed to fetch past fills', error);
        }
    };
};

export const fetchPastMarketFills: ThunkCreator<Promise<void>> = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const currencyPair = getCurrencyPair(state);
        const market = marketToString(currencyPair);
        try {
            const marketFillsResponse = await getMarketFillsFromRelayer(market);
            const known_tokens = getKnownTokens();

            if (marketFillsResponse) {
                const fills = marketFillsResponse.records;
                if (fills.length > 0) {
                    const filteredFills = fills
                        .filter(
                            f =>
                                known_tokens.isKnownAddress(f.tokenQuoteAddress) &&
                                known_tokens.isKnownAddress(f.tokenBaseAddress),
                        )
                        .map(mapRelayerFillToFill);
                    if (filteredFills && filteredFills.length > 0) {
                        const marketsFill: MarketFill = {};
                        filteredFills.forEach(f => {
                            if (marketsFill[f.market]) {
                                marketsFill[f.market].push(f);
                            } else {
                                marketsFill[f.market] = [f];
                            }
                        });
                        dispatch(addMarketFills(marketsFill));
                    }
                }
            }
        } catch (error) {
            logger.error('Failed to fetch past market fills', error);
        }
    };
};

export const fetchTakerAndMakerFeeIEO: ThunkCreator<Promise<OrderFeeData>> = (
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

        const order = await buildLimitOrderIEO(
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

        const { makerFee, takerFee, makerFeeAssetData, takerFeeAssetData } = order;

        return {
            makerFee,
            takerFee,
            makerFeeAssetData,
            takerFeeAssetData,
        };
    };
};

export const submitConfigFile: ThunkCreator<Promise<ConfigRelayerData | undefined>> = (config: ConfigRelayerData) => {
    return async (_dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        config.owner = ethAccount;
        return postConfig(config);
    };
    // tslint:disable-next-line: max-file-line-count
};
