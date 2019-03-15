import { BigNumber, SignedOrder } from '0x.js';
import { createAction } from 'typesafe-actions';

import { TX_DEFAULTS } from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { cancelSignedOrder, getAllOrdersAsUIOrders, getUserOrdersAsUIOrders } from '../../services/orders';
import { getRelayer } from '../../services/relayer';
import { getWeb3WrapperOrThrow } from '../../services/web3_wrapper';
import { buildMarketOrders } from '../../util/orders';
import { NotificationKind, OrderSide, RelayerState, Token, UIOrder } from '../../util/types';
import { getEthAccount, getOpenBuyOrders, getOpenSellOrders, getSelectedToken } from '../selectors';
import { addNotification } from '../ui/actions';

export const initializeRelayerData = createAction('INITIALIZE_RELAYER_DATA', resolve => {
    return (relayerData: RelayerState) => resolve(relayerData);
});

export const setOrders = createAction('SET_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction('SET_USER_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setSelectedToken = createAction('SET_SELECTED_TOKEN', resolve => {
    return (selectedToken: Token | null) => resolve(selectedToken);
});

export const getAllOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;
        const uiOrders = await getAllOrdersAsUIOrders(selectedToken);

        dispatch(setOrders(uiOrders));
    };
};

export const getUserOrders = () => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;
        const ethAccount = getEthAccount(state);
        const myUIOrders = await getUserOrdersAsUIOrders(selectedToken, ethAccount);

        dispatch(setUserOrders(myUIOrders));
    };
};

export const cancelOrder = (order: UIOrder) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;

        await cancelSignedOrder(order.rawOrder);

        dispatch(getOrderbookAndUserOrders());
        dispatch(
            addNotification({
                kind: NotificationKind.CancelOrder,
                amount: order.size,
                token: selectedToken,
                timestamp: new Date(),
            }),
        );
    };
};

export const submitLimitOrder = (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const selectedToken = getSelectedToken(state) as Token;

        const submitResult = await getRelayer().client.submitOrderAsync(signedOrder);

        dispatch(getOrderbookAndUserOrders());
        dispatch(
            addNotification({
                kind: NotificationKind.Limit,
                amount,
                token: selectedToken,
                side,
                timestamp: new Date(),
            }),
        );

        return submitResult;
    };
};

export const submitMarketOrder = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const selectedToken = getSelectedToken(state) as Token;

        const contractWrappers = await getContractWrappers();
        const web3Wrapper = await getWeb3WrapperOrThrow();

        const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);

        const [ordersToFill, amounts, canBeFilled] = buildMarketOrders(
            {
                amount,
                orders,
            },
            side,
        );

        if (canBeFilled) {
            const txHash = await contractWrappers.exchange.batchFillOrdersAsync(
                ordersToFill,
                amounts,
                ethAccount,
                TX_DEFAULTS,
            );
            dispatch(getOrderbookAndUserOrders());

            const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

            dispatch(
                addNotification({
                    kind: NotificationKind.Market,
                    amount,
                    token: selectedToken,
                    side,
                    tx,
                    timestamp: new Date(),
                }),
            );
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
