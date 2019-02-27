import { assetDataUtils, BigNumber, generatePseudoRandomSalt, Order } from '0x.js';

import { FEE_RECIPIENT, MAKER_FEE, TAKER_FEE, ZERO_ADDRESS } from '../common/constants';

import { getEthereumPriceInUSD } from './market_prices';
import { tokenAmountInUnits } from './tokens';
import { OrderSide } from './types';

interface BuildOrderParams {
    account: string;
    tokenAddress: string;
    wethAddress: string;
    amount: BigNumber;
    price: number;
    exchangeAddress: string;
}

export const buildOrder = (params: BuildOrderParams, side: OrderSide): Order => {
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
        makerFee: new BigNumber(MAKER_FEE),
        takerFee: new BigNumber(TAKER_FEE),
        salt: generatePseudoRandomSalt(),
        senderAddress: '0x0000000000000000000000000000000000000000',
    };
};

export const orderDetailsFeeEther = (
    orderPrice: BigNumber,
    orderType: OrderSide,
    tokenDecimals: number = 18,
): BigNumber => {
    let fee = new BigNumber(1);
    if (orderType === OrderSide.Buy) {
        fee = new BigNumber(MAKER_FEE);
    }

    if (orderType === OrderSide.Sell) {
        fee = new BigNumber(TAKER_FEE);
    }

    // Fee is a percentage
    const orderPriceConverted = tokenAmountInUnits(orderPrice, tokenDecimals);
    return fee.mul(orderPriceConverted).div(100);
};

export const orderDetailsFeeDollar = async (
    orderPrice: BigNumber,
    orderType: OrderSide,
    tokenDecimals: number = 18,
): Promise<BigNumber> => {
    const priceInEther = orderDetailsFeeEther(orderPrice, orderType, tokenDecimals);
    const priceInDollar = await getEthereumPriceInUSD();

    return priceInEther.mul(priceInDollar);
};
