import { assetDataUtils, BigNumber, generatePseudoRandomSalt, Order, SignedOrder } from '0x.js';

import { FEE_RECIPIENT, MAKER_FEE, TAKER_FEE, ZERO_ADDRESS } from '../common/constants';
import { OrderSide, UIOrder } from '../util/types';

interface BuildLimitOrderParams {
    account: string;
    amount: BigNumber;
    exchangeAddress: string;
    price: BigNumber;
    tokenAddress: string;
    wethAddress: string;
}

interface BuildMarketOrderParams {
    amount: BigNumber;
    orders: UIOrder[];
}

export const buildLimitOrder = (params: BuildLimitOrderParams, side: OrderSide): Order => {
    const { account, exchangeAddress, amount, price, tokenAddress, wethAddress } = params;
    const tomorrow = new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);

    const tokenAssetData = assetDataUtils.encodeERC20AssetData(tokenAddress);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow,
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === OrderSide.Buy ? amount.mul(price) : amount,
        makerAssetData: side === OrderSide.Buy ? wethAssetData : tokenAssetData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === OrderSide.Buy ? amount : amount.mul(price),
        takerAssetData: side === OrderSide.Buy ? tokenAssetData : wethAssetData,
        makerFee: MAKER_FEE,
        takerFee: TAKER_FEE,
        salt: generatePseudoRandomSalt(),
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
