import { assetDataUtils, BigNumber, OrderAndTraderInfo } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { orderCalculationUtils } from '@0x/order-utils';

import { UI_DECIMALS_DISPLAYED_PRICE_ETH } from '../common/constants';

import { getKnownTokens } from './known_tokens';
import { getLogger } from './logger';
import { tokenAmountInUnitsToBigNumber } from './tokens';
import { OrderBookItem, OrderSide, Token, UIOrder } from './types';
const logger = getLogger('ui_orders');

export const ordersToUIOrders = (
    orders: SignedOrder[],
    baseToken: Token,
    orderAndTraderInfo?: OrderAndTraderInfo[],
): UIOrder[] => {
    if (orderAndTraderInfo) {
        return filterUIOrders(ordersToUIOrdersWithOrdersInfo(orders, orderAndTraderInfo, baseToken));
    } else {
        return filterUIOrders(ordersToUIOrdersWithoutOrderInfo(orders, baseToken));
    }
};

// The user does not have web3 and the order info could not be retrieved from the contract
const ordersToUIOrdersWithoutOrderInfo = (orders: SignedOrder[], baseToken: Token): UIOrder[] => {
    const baseTokenEncoded = assetDataUtils.encodeERC20AssetData(baseToken.address);

    return orders.map((order, i) => {
        const side = order.takerAssetData === baseTokenEncoded ? OrderSide.Buy : OrderSide.Sell;
        const size = side === OrderSide.Sell ? order.makerAssetAmount : order.takerAssetAmount;
        const filled = null;
        const status = null;
        const isSell = side === OrderSide.Sell;
        const makerAssetAddress = assetDataUtils.decodeERC20AssetData(order.makerAssetData).tokenAddress;
        const makerAssetTokenDecimals = getKnownTokens().getTokenByAddress(makerAssetAddress).decimals;
        const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(order.makerAssetAmount, makerAssetTokenDecimals);

        const takerAssetAddress = assetDataUtils.decodeERC20AssetData(order.takerAssetData).tokenAddress;
        const takerAssetTokenDecimals = getKnownTokens().getTokenByAddress(takerAssetAddress).decimals;
        const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(order.takerAssetAmount, takerAssetTokenDecimals);
        const price = isSell
            ? takerAssetAmountInUnits.div(makerAssetAmountInUnits)
            : makerAssetAmountInUnits.div(takerAssetAmountInUnits);

        return {
            rawOrder: order,
            side,
            size,
            filled,
            price,
            status,
            makerFillableAmountInTakerAsset: order.takerAssetAmount,
            remainingTakerAssetFillAmount: order.takerAssetAmount,
        };
    });
};

// Filters the UI orders that are unfillable
const filterUIOrders = (orders: UIOrder[]): UIOrder[] => {
    // For Market Fill we remove ANY orders which cannot be filled for their remaining amount.
    const marketFillFilter = (o: UIOrder) =>
        o.makerFillableAmountInTakerAsset.isGreaterThan(o.remainingTakerAssetFillAmount);
    const filteredOrders = orders.filter(marketFillFilter);
    logger.info(`filtered ${orders.length - filteredOrders.length}/${orders.length} orders`);
    return filteredOrders;
};

// The user has web3 and the order info could be retrieved from the contract
const ordersToUIOrdersWithOrdersInfo = (
    orders: SignedOrder[],
    orderAndTraderInfos: OrderAndTraderInfo[],
    baseToken: Token,
): UIOrder[] => {
    if (orderAndTraderInfos.length !== orders.length) {
        throw new Error(
            `AssertionError: Orders info length does not match orders length: ${orderAndTraderInfos.length} !== ${
                orders.length
            }`,
        );
    }

    const selectedTokenEncoded = assetDataUtils.encodeERC20AssetData(baseToken.address);

    return orders.map((order, i) => {
        const orderAndTraderInfo = orderAndTraderInfos[i];

        const side = order.takerAssetData === selectedTokenEncoded ? OrderSide.Buy : OrderSide.Sell;
        const isSell = side === OrderSide.Sell;
        const size = isSell ? order.makerAssetAmount : order.takerAssetAmount;

        const makerAssetAddress = assetDataUtils.decodeERC20AssetData(order.makerAssetData).tokenAddress;
        const makerAssetTokenDecimals = getKnownTokens().getTokenByAddress(makerAssetAddress).decimals;
        const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(order.makerAssetAmount, makerAssetTokenDecimals);

        const takerAssetAddress = assetDataUtils.decodeERC20AssetData(order.takerAssetData).tokenAddress;
        const takerAssetTokenDecimals = getKnownTokens().getTokenByAddress(takerAssetAddress).decimals;
        const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(order.takerAssetAmount, takerAssetTokenDecimals);

        const orderTakerAssetFilledAmount = orderAndTraderInfo.orderInfo.orderTakerAssetFilledAmount;
        const remainingTakerAssetFillAmount = order.takerAssetAmount.minus(orderTakerAssetFilledAmount);
        const makerAssetFilledAmount = orderCalculationUtils.getMakerFillAmount(order, orderTakerAssetFilledAmount);
        const makerFillableAmount = BigNumber.min(
            orderAndTraderInfo.traderInfo.makerAllowance,
            orderAndTraderInfo.traderInfo.makerBalance,
        );
        const makerFillableAmountInTakerAsset = orderCalculationUtils.getTakerFillAmount(order, makerFillableAmount);
        const filled = isSell ? makerAssetFilledAmount : orderTakerAssetFilledAmount;
        const price = isSell
            ? takerAssetAmountInUnits.div(makerAssetAmountInUnits)
            : makerAssetAmountInUnits.div(takerAssetAmountInUnits);
        const status = orderAndTraderInfo.orderInfo.orderStatus;

        return {
            rawOrder: order,
            side,
            size,
            filled,
            price,
            status,
            makerFillableAmountInTakerAsset,
            remainingTakerAssetFillAmount,
        };
    });
};

export const mergeByPrice = (orders: UIOrder[]): OrderBookItem[] => {
    const initialValue: { [x: string]: UIOrder[] } = {};
    const ordersByPrice = orders.reduce((acc, order) => {
        acc[order.price.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)] =
            acc[order.price.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)] || [];
        acc[order.price.toFixed(UI_DECIMALS_DISPLAYED_PRICE_ETH)].push(order);
        return acc;
    }, initialValue);

    // Returns an array of OrderBookItem
    return Object.keys(ordersByPrice)
        .map(price => {
            return ordersByPrice[price].reduce((acc, order) => {
                return {
                    ...acc,
                    size: acc.size.plus(order.size),
                };
            });
        })
        .map(order => {
            let newSize = order.size;
            if (order.filled) {
                newSize = order.size.minus(order.filled);
            }

            return {
                side: order.side,
                price: order.price,
                size: newSize,
            };
        });
};
