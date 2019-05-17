import { assetDataUtils, BigNumber, DutchAuctionWrapper, Order, SignedOrder } from '0x.js';

import { FEE_RECIPIENT, MAKER_FEE, TAKER_FEE, ZERO_ADDRESS } from '../common/constants';

import { tomorrow } from './time_utils';
import { OrderSide, UIOrder } from './types';

interface BuildSellCollectibleOrderParams {
    collectibleAddress: string;
    collectibleId: BigNumber;
    account: string;
    amount: BigNumber;
    exchangeAddress: string;
    wethAddress: string;
    price: BigNumber;
}

interface DutchAuctionOrderParams extends BuildSellCollectibleOrderParams {
    endPrice: BigNumber;
    expirationDate: BigNumber;
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

export const buildDutchAuctionCollectibleOrder = (params: DutchAuctionOrderParams) => {
    const {
        account,
        collectibleId,
        collectibleAddress,
        amount,
        price,
        exchangeAddress,
        wethAddress,
        senderAddress,
        expirationDate,
        endPrice,
    } = params;
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const beginTimeSeconds = new BigNumber(Math.round(Date.now() / 1000));
    const auctionAssetData = DutchAuctionWrapper.encodeDutchAuctionAssetData(collectibleData, beginTimeSeconds, price);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);
    return {
        makerAddress: account,
        exchangeAddress,
        takerAddress: ZERO_ADDRESS,
        senderAddress,
        feeRecipientAddress: FEE_RECIPIENT,
        expirationTimeSeconds: expirationDate,
        salt: new BigNumber(Date.now()),
        makerAssetData: auctionAssetData,
        takerAssetData: wethAssetData,
        makerAssetAmount: amount,
        takerAssetAmount: endPrice,
        makerFee: MAKER_FEE,
        takerFee: TAKER_FEE,
    };
};

export const buildSellCollectibleOrder = (params: BuildSellCollectibleOrderParams, side: OrderSide) => {
    const { account, collectibleId, collectibleAddress, amount, price, exchangeAddress, wethAddress } = params;
    const collectibleData = assetDataUtils.encodeERC721AssetData(collectibleAddress, collectibleId);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);
    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow(),
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === OrderSide.Buy ? amount.multipliedBy(price) : amount,
        makerAssetData: collectibleData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.multipliedBy(price),
        takerAssetData: wethAssetData,
        makerFee: MAKER_FEE,
        takerFee: TAKER_FEE,
        salt: new BigNumber(Date.now()),
        senderAddress: ZERO_ADDRESS,
    };
};

export const buildLimitOrder = (params: BuildLimitOrderParams, side: OrderSide): Order => {
    const { account, baseTokenAddress, exchangeAddress, amount, price, quoteTokenAddress } = params;

    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseTokenAddress);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteTokenAddress);

    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow(),
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === OrderSide.Buy ? amount.multipliedBy(price) : amount,
        makerAssetData: side === OrderSide.Buy ? quoteTokenAssetData : baseTokenAssetData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.multipliedBy(price),
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
            amounts[i] = amounts[i].multipliedBy(order.price);
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
