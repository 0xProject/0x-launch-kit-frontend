import { assetDataUtils, BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { TX_DEFAULTS } from '../common/constants';
import { getOpenBuyOrders, getOpenSellOrders } from '../store/selectors';
import { buildMarketOrders } from '../util/orders';
import { OrderSide, StoreState, Token } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getRelayer } from './relayer';
import { getWeb3WrapperOrThrow } from './web3_wrapper';

export const getAllOrders = (token: Token) => {
    const relayer = getRelayer();
    const tokenAssetData = assetDataUtils.encodeERC20AssetData(token.address);
    return relayer.getAllOrdersAsync(tokenAssetData);
};

export const getAllOrdersAsUIOrders = async (token: Token) => {
    const orders = await getAllOrders(token);
    const contractWrappers = await getContractWrappers();
    const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
    return ordersToUIOrders(orders, ordersInfo, token);
};

export const getUserOrders = (token: Token, ethAccount: string) => {
    const relayer = getRelayer();
    const selectedTokenAssetData = assetDataUtils.encodeERC20AssetData(token.address);
    return relayer.getUserOrdersAsync(ethAccount, selectedTokenAssetData);
};

export const getUserOrdersAsUIOrders = async (token: Token, ethAccount: string) => {
    const myOrders = await getUserOrders(token, ethAccount);
    const contractWrappers = await getContractWrappers();
    const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
    return ordersToUIOrders(myOrders, myOrdersInfo, token);
};

export const cancelSignedOrder = async (order: SignedOrder) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3WrapperOrThrow();
    const tx = await contractWrappers.exchange.cancelOrderAsync(order, TX_DEFAULTS);
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};

export const getAllOrdersToFillMarketOrderAndAmountsToPay = (
    amount: BigNumber,
    side: OrderSide,
    state: StoreState,
): [SignedOrder[], BigNumber[], boolean] => {
    const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
    let ordersToFillReturn: SignedOrder[];
    let amountToPayForEachOrderReturn: BigNumber[];
    const [ordersToFill, amountToPayForEachOrder, canBeFilled] = buildMarketOrders(
        {
            amount,
            orders,
        },
        side,
    );
    if (canBeFilled) {
        ordersToFillReturn = ordersToFill;
        amountToPayForEachOrderReturn = amountToPayForEachOrder;
    } else {
        ordersToFillReturn = [];
        amountToPayForEachOrderReturn = [];
    }

    return [ordersToFillReturn, amountToPayForEachOrderReturn, canBeFilled];
};
