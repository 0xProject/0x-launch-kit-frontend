import { assetDataUtils, BigNumber, Order, SignedOrder } from '0x.js';

import { FEE_RECIPIENT, MAKER_FEE, TAKER_FEE, ZERO_ADDRESS } from '../common/constants';

import { OrderSide, UIOrder } from './types';

interface BuildSellCollectibleOrderParams {
    collectibleAddress: string;
    collectibleId: BigNumber;
    account: string;
    amount: BigNumber;
    price: BigNumber;
    exchangeAddress: string;
    wethAddress: string;
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

export const buildSellCollectibleOrder = (params: BuildSellCollectibleOrderParams, side: OrderSide) => {
    const { account, collectibleId, collectibleAddress, amount, price, exchangeAddress, wethAddress } = params;
    const tomorrow = new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow,
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === OrderSide.Buy ? amount.mul(price) : amount,
        makerAssetData: collectibleData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.mul(price),
        takerAssetData: wethAssetData,
        makerFee: MAKER_FEE,
        takerFee: TAKER_FEE,
        salt: new BigNumber(Date.now()),
        senderAddress: ZERO_ADDRESS,
    };
};

export const buildLimitOrder = (params: BuildLimitOrderParams, side: OrderSide): Order => {
    const { account, baseTokenAddress, exchangeAddress, amount, price, quoteTokenAddress } = params;
    const tomorrow = new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);

    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseTokenAddress);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteTokenAddress);

    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow,
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === OrderSide.Buy ? amount.mul(price) : amount,
        makerAssetData: side === OrderSide.Buy ? quoteTokenAssetData : baseTokenAssetData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.mul(price),
        takerAssetData: side === OrderSide.Buy ? baseTokenAssetData : quoteTokenAssetData,
        makerFee: MAKER_FEE,
        takerFee: TAKER_FEE,
        salt: new BigNumber(Date.now()),
        senderAddress: '0x0000000000000000000000000000000000000000',
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
    for (let i = 0; i < sortedOrders.length && filledAmount.lessThan(amount); i++) {
        const order = sortedOrders[i];
        ordersToFill.push(order.rawOrder);

        let available = order.size;
        if (order.filled) {
            available = order.size.sub(order.filled);
        }
        if (filledAmount.plus(available).greaterThan(amount)) {
            amounts.push(amount.sub(filledAmount));
            filledAmount = amount;
        } else {
            amounts.push(available);
            filledAmount = filledAmount.plus(available);
        }

        if (side === OrderSide.Buy) {
            amounts[i] = amounts[i].mul(order.price);
        }
    }
    const canBeFilled = filledAmount.eq(amount);

    const roundedAmounts = amounts.map(a => a.ceil());

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
        return sum.add(amounts[index].mul(price));
    }, new BigNumber(0));
};
