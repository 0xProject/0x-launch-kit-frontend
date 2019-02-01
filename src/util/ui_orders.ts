import { assetDataUtils, OrderInfo } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { Token, UIOrder, UIOrderSide } from '../util/types';

export const ordersToUIOrders = (orders: SignedOrder[], ordersInfo: OrderInfo[], selectedToken: Token): UIOrder[] => {
    if (ordersInfo.length !== orders.length) {
        throw new Error(`AssertionError: Orders info length does not match orders length: ${ordersInfo.length} !== ${orders.length}`);
    }

    const selectedTokenEncoded = assetDataUtils.encodeERC20AssetData(selectedToken.address);

    return orders.map((order, i) => {
        const orderInfo = ordersInfo[i];

        const side = order.takerAssetData === selectedTokenEncoded ? UIOrderSide.Buy : UIOrderSide.Sell;
        const size = order.makerAssetAmount;
        const filled = orderInfo.orderTakerAssetFilledAmount;
        const price = side === UIOrderSide.Buy ? order.makerAssetAmount.div(order.takerAssetAmount) : order.takerAssetAmount.div(order.makerAssetAmount);
        const status = orderInfo.orderStatus;

        return {
            rawOrder: order,
            side,
            size,
            filled,
            price,
            status,
        };
    });
};
