import { assetDataUtils, BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { TX_DEFAULTS } from '../common/constants';
import { buildMarketOrders } from '../util/orders';
import { OrderSide, Token, UIOrder } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getRelayer } from './relayer';
import { getWeb3WrapperOrThrow } from './web3_wrapper';

export const getAllOrders = (baseToken: Token, quoteToken: Token) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    return relayer.getAllOrdersAsync(baseTokenAssetData, quoteTokenAssetData);
};

export const getAllOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token) => {
    const orders = await getAllOrders(baseToken, quoteToken);
    const contractWrappers = await getContractWrappers();
    const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
    return ordersToUIOrders(orders, ordersInfo, baseToken);
};

export const getUserOrders = (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    return relayer.getUserOrdersAsync(ethAccount, baseTokenAssetData, quoteTokenAssetData);
};

export const getUserOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const myOrders = await getUserOrders(baseToken, quoteToken, ethAccount);
    const contractWrappers = await getContractWrappers();
    const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
    return ordersToUIOrders(myOrders, myOrdersInfo, baseToken);
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
    orders: UIOrder[],
): [SignedOrder[], BigNumber[], boolean] => {
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
