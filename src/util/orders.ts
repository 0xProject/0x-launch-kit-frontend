import { assetDataUtils, BigNumber, DutchAuctionWrapper, Order, SignedOrder } from '0x.js';
import { OrderConfigRequest } from '@0x/connect';

import { ZERO_ADDRESS } from '../common/constants';
import { getRelayer } from '../services/relayer';

import { getKnownTokens } from './known_tokens';
import * as orderHelper from './orders';

import { getExpirationTimeOrdersFromConfig } from './time_utils';
import { tokenAmountInUnitsToBigNumber, unitsInTokenAmount } from './tokens';
import { OrderSide, UIOrder } from './types';

interface BuildSellCollectibleOrderParams {
    collectibleAddress: string;
    collectibleId: BigNumber;
    account: string;
    amount: BigNumber;
    exchangeAddress: string;
    expirationDate: BigNumber;
    wethAddress: string;
    price: BigNumber;
}

interface DutchAuctionOrderParams extends BuildSellCollectibleOrderParams {
    endPrice: BigNumber;
    senderAddress: string;
}

interface BuildLimitOrderParams {
    account: string;
    amount: BigNumber;
    baseTokenAddress: string;
    exchangeAddress: string;
    price: BigNumber;
    quoteTokenAddress: string;
}

interface BuildMarketOrderParams {
    amount: BigNumber;
    orders: UIOrder[];
}

export const buildDutchAuctionCollectibleOrder = async (params: DutchAuctionOrderParams) => {
    const {
        account,
        collectibleId,
        collectibleAddress,
        amount,
        price,
        exchangeAddress,
        wethAddress,
        expirationDate,
        endPrice,
    } = params;
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const beginTimeSeconds = new BigNumber(Math.round(Date.now() / 1000));
    const auctionAssetData = DutchAuctionWrapper.encodeDutchAuctionAssetData(collectibleData, beginTimeSeconds, price);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    const orderConfigRequest: OrderConfigRequest = {
        exchangeAddress,
        makerAssetData: auctionAssetData,
        takerAssetData: wethAssetData,
        makerAssetAmount: amount,
        takerAssetAmount: endPrice,
        makerAddress: account,
        takerAddress: ZERO_ADDRESS,
        expirationTimeSeconds: expirationDate,
    };

    return orderHelper.getOrderWithTakerAndFeeConfigFromRelayer(orderConfigRequest);
};

export const buildSellCollectibleOrder = async (params: BuildSellCollectibleOrderParams, side: OrderSide) => {
    const {
        account,
        collectibleId,
        collectibleAddress,
        amount,
        price,
        exchangeAddress,
        expirationDate,
        wethAddress,
    } = params;
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    const orderConfigRequest: OrderConfigRequest = {
        exchangeAddress,
        makerAssetData: collectibleData,
        takerAssetData: wethAssetData,
        makerAssetAmount: side === OrderSide.Buy ? amount.multipliedBy(price) : amount,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.multipliedBy(price),
        makerAddress: account,
        takerAddress: ZERO_ADDRESS,
        expirationTimeSeconds: expirationDate,
    };

    return orderHelper.getOrderWithTakerAndFeeConfigFromRelayer(orderConfigRequest);
};

export const buildLimitOrder = async (params: BuildLimitOrderParams, side: OrderSide): Promise<Order> => {
    const { account, baseTokenAddress, exchangeAddress, amount, price, quoteTokenAddress } = params;

    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseTokenAddress);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteTokenAddress);

    const baseTokenDecimals = getKnownTokens().getTokenByAddress(baseTokenAddress).decimals;
    const baseTokenAmountInUnits = tokenAmountInUnitsToBigNumber(amount, baseTokenDecimals);

    const quoteTokenAmountInUnits = baseTokenAmountInUnits.multipliedBy(price);

    const quoteTokenDecimals = getKnownTokens().getTokenByAddress(quoteTokenAddress).decimals;
    const quoteTokenAmountInBaseUnits = unitsInTokenAmount(quoteTokenAmountInUnits.toString(), quoteTokenDecimals);

    const isBuy = side === OrderSide.Buy;

    const orderConfigRequest: OrderConfigRequest = {
        exchangeAddress,
        makerAssetData: isBuy ? quoteTokenAssetData : baseTokenAssetData,
        takerAssetData: isBuy ? baseTokenAssetData : quoteTokenAssetData,
        makerAssetAmount: isBuy ? quoteTokenAmountInBaseUnits : amount,
        takerAssetAmount: isBuy ? amount : quoteTokenAmountInBaseUnits,
        makerAddress: account,
        takerAddress: ZERO_ADDRESS,
        expirationTimeSeconds: getExpirationTimeOrdersFromConfig(),
    };

    return orderHelper.getOrderWithTakerAndFeeConfigFromRelayer(orderConfigRequest);
};

export const getOrderWithTakerAndFeeConfigFromRelayer = async (orderConfigRequest: OrderConfigRequest) => {
    const client = getRelayer();
    const orderResult = await client.getOrderConfigAsync(orderConfigRequest);

    return {
        ...orderConfigRequest,
        ...orderResult,
        salt: new BigNumber(Date.now()),
    };
};

export const buildMarketOrders = (
    params: BuildMarketOrderParams,
    side: OrderSide,
): [SignedOrder[], BigNumber[], boolean] => {
    const { amount, orders } = params;

    // sort orders from best to worse
    const sortedOrders = orders.sort((a, b) => {
        if (side === OrderSide.Buy) {
            return a.price.comparedTo(b.price);
        } else {
            return b.price.comparedTo(a.price);
        }
    });

    const ordersToFill: SignedOrder[] = [];
    const amounts: BigNumber[] = [];
    let filledAmount = new BigNumber(0);
    for (let i = 0; i < sortedOrders.length && filledAmount.isLessThan(amount); i++) {
        const order = sortedOrders[i];
        ordersToFill.push(order.rawOrder);

        let available = order.size;
        if (order.filled) {
            available = order.size.minus(order.filled);
        }
        if (filledAmount.plus(available).isGreaterThan(amount)) {
            amounts.push(amount.minus(filledAmount));
            filledAmount = amount;
        } else {
            amounts.push(available);
            filledAmount = filledAmount.plus(available);
        }

        if (side === OrderSide.Buy) {
            // @TODO: cache maker/taker info (decimals)
            const makerTokenDecimals = getKnownTokens().getTokenByAssetData(order.rawOrder.makerAssetData).decimals;
            const takerTokenDecimals = getKnownTokens().getTokenByAssetData(order.rawOrder.takerAssetData).decimals;
            const buyAmount = tokenAmountInUnitsToBigNumber(amounts[i], makerTokenDecimals);
            amounts[i] = unitsInTokenAmount(buyAmount.multipliedBy(order.price).toString(), takerTokenDecimals);
        }
    }
    const canBeFilled = filledAmount.eq(amount);

    const roundedAmounts = amounts.map(a => a.integerValue(BigNumber.ROUND_CEIL));

    return [ordersToFill, roundedAmounts, canBeFilled];
};

export const sumTakerAssetFillableOrders = (
    side: OrderSide,
    ordersToFill: Order[],
    amounts: BigNumber[],
): BigNumber => {
    if (ordersToFill.length !== amounts.length) {
        throw new Error('ordersToFill and amount array lengths must be the same.');
    }
    if (ordersToFill.length === 0) {
        return new BigNumber(0);
    }
    return ordersToFill.reduce((sum, order, index) => {
        // Check buildMarketOrders for more details
        const price = side === OrderSide.Buy ? 1 : order.makerAssetAmount.div(order.takerAssetAmount);
        return sum.plus(amounts[index].multipliedBy(price));
    }, new BigNumber(0));
};

export const getDutchAuctionData = (assetData: string) => {
    return DutchAuctionWrapper.decodeDutchAuctionData(assetData);
};

export const isDutchAuction = (order: SignedOrder) => {
    try {
        getDutchAuctionData(order.makerAssetData);
        return true;
    } catch (e) {
        return false;
    }
};
