import { assetDataUtils, BigNumber, generatePseudoRandomSalt, Order } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { FEE_RECIPIENT, MAKER_FEE, TAKER_FEE, ZERO_ADDRESS } from '../common/constants';
import { OrderBookItem, Token, UIOrder, UIOrderSide } from '../util/types';

interface BuildOrderParams {
    account: string;
    tokenAddress: string;
    wethAddress: string;
    amount: BigNumber;
    price: number;
    exchangeAddress: string;
}

export const buildOrder = (params: BuildOrderParams, side: UIOrderSide): Order => {
    const { account, exchangeAddress, amount, price, tokenAddress, wethAddress } = params;
    const tomorrow = new BigNumber(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);

    const tokenAssetData = assetDataUtils.encodeERC20AssetData(tokenAddress);
    const wethAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    return {
        exchangeAddress,
        expirationTimeSeconds: tomorrow,
        feeRecipientAddress: FEE_RECIPIENT,
        makerAddress: account,
        makerAssetAmount: side === UIOrderSide.Buy ? amount.mul(price) : amount,
        makerAssetData: side === UIOrderSide.Buy ? wethAssetData : tokenAssetData,
        takerAddress: ZERO_ADDRESS,
        takerAssetAmount: side === UIOrderSide.Buy ? amount : amount.mul(price),
        takerAssetData: side === UIOrderSide.Buy ? tokenAssetData : wethAssetData,
        makerFee: new BigNumber(MAKER_FEE),
        takerFee: new BigNumber(TAKER_FEE),
        salt: generatePseudoRandomSalt(),
        senderAddress: '0x0000000000000000000000000000000000000000',
    };
};
