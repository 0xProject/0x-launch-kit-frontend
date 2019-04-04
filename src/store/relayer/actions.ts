import { BigNumber, SignedOrder } from '0x.js';
import { createAction } from 'typesafe-actions';

import { TX_DEFAULTS } from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { cancelSignedOrder, getAllOrdersAsUIOrders, getUserOrdersAsUIOrders } from '../../services/orders';
import { getRelayer } from '../../services/relayer';
import { getWeb3WrapperOrThrow } from '../../services/web3_wrapper';
import { buildMarketOrders } from '../../util/orders';
import { NotificationKind, OrderSide, RelayerState, Token, UIOrder } from '../../util/types';
import {
    getBaseToken,
    getEthAccount,
    getGasPriceInWei,
    getOpenBuyOrders,
    getOpenSellOrders,
    getQuoteToken,
} from '../selectors';
import { addNotifications } from '../ui/actions';

export const initializeRelayerData = createAction('INITIALIZE_RELAYER_DATA', resolve => {
    return (relayerData: RelayerState) => resolve(relayerData);
});

export const setOrders = createAction('SET_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction('SET_USER_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const getAllOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const uiOrders = await getAllOrdersAsUIOrders(baseToken, quoteToken);

        dispatch(setOrders(uiOrders));
    };
};

export const getUserOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;
        const ethAccount = getEthAccount(state);
        const myUIOrders = await getUserOrdersAsUIOrders(baseToken, quoteToken, ethAccount);

        dispatch(setUserOrders(myUIOrders));
    };
};

export const cancelOrder = (order: UIOrder) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;
        const gasPrice = getGasPriceInWei(state);

        const tx = cancelSignedOrder(order.rawOrder, gasPrice);

        // tslint:disable-next-line:no-floating-promises no-unsafe-any
        tx.then(transaction => {
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

export const submitLimitOrder = (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const baseToken = getBaseToken(state) as Token;

        const submitResult = await getRelayer().client.submitOrderAsync(signedOrder);

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
    };
};

export const submitMarketOrder = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
        const [ordersToFill, amounts, canBeFilled] = buildMarketOrders(
            {
                amount,
                orders,
            },
            side,
        );

        if (canBeFilled) {
            const baseToken = getBaseToken(state) as Token;

            const contractWrappers = await getContractWrappers();
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const txHash = await contractWrappers.exchange.batchFillOrdersAsync(ordersToFill, amounts, ethAccount, {
                ...TX_DEFAULTS,
                gasPrice,
            });

            const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

            dispatch(getOrderbookAndUserOrders());

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

            return txHash;
        } else {
            window.alert('There are no enough orders to fill this amount');
        }
    };
};

export const getOrderbookAndUserOrders = () => {
    return async (dispatch: any) => {
        dispatch(getAllOrders());
        dispatch(getUserOrders());
    };
};

export const getOrderBook = () => {
    return async (dispatch: any) => {
        dispatch(getAllOrders());
    };
};
