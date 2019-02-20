import { assetDataUtils, BigNumber, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { Token, UIOrder, UIOrderSide } from './types';

export const mockToken1: Token = {
    address: '0xBA50C9066a29268904Bd074C1C6A17f3575a84e7',
    decimals: 18,
    symbol: 'MOCK1',
};

const mockToken2: Token = {
    address: '0x1F7B687533F4Afa4fAA41c2D2fBca05Cc0C3Fd65',
    decimals: 18,
    symbol: 'MOCK2',
};

export const makeSellOrder = ({
    makerAssetAmount,
    takerAssetAmount,
}: {
    makerAssetAmount: string;
    takerAssetAmount: string;
}): SignedOrder => {
    const oneYearFromNow = Math.floor(new Date().valueOf() / 1000) + 3600 * 24 * 365;

    return {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        takerAddress: '0x0000000000000000000000000000000000000000',
        senderAddress: '0x0000000000000000000000000000000000000000',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        expirationTimeSeconds: new BigNumber(oneYearFromNow),
        salt: new BigNumber('4253024946184612711043400606072358480456814389671017608724053124375087745'),
        makerAssetAmount: new BigNumber(makerAssetAmount),
        takerAssetAmount: new BigNumber(takerAssetAmount),
        makerAssetData: assetDataUtils.encodeERC20AssetData(mockToken1.address),
        takerAssetData: assetDataUtils.encodeERC20AssetData(mockToken2.address),
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber('0'),
        signature: '',
    };
};

export const makeBuyOrder = ({
    makerAssetAmount,
    takerAssetAmount,
}: {
    makerAssetAmount: string;
    takerAssetAmount: string;
}) => {
    const oneYearFromNow = Math.floor(new Date().valueOf() / 1000) + 3600 * 24 * 365;

    return {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        takerAddress: '0x0000000000000000000000000000000000000000',
        senderAddress: '0x0000000000000000000000000000000000000000',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        expirationTimeSeconds: new BigNumber(oneYearFromNow),
        salt: new BigNumber('4253024946184612711043400606072358480456814389671017608724053124375087745'),
        makerAssetAmount: new BigNumber(makerAssetAmount),
        takerAssetAmount: new BigNumber(takerAssetAmount),
        makerAssetData: assetDataUtils.encodeERC20AssetData(mockToken2.address),
        takerAssetData: assetDataUtils.encodeERC20AssetData(mockToken1.address),
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber('0'),
        signature: '',
    };
};

export const uiOrder = (params = {}): UIOrder => {
    const rawOrder: any = {};
    const filledN = new BigNumber(0);
    const sizeN = new BigNumber(10);
    return {
        filled: filledN,
        price: new BigNumber(1),
        rawOrder,
        side: UIOrderSide.Sell,
        size: sizeN,
        status: OrderStatus.Fillable,
        emptySize: filledN.minus(filledN),
        ...params,
    };
};

export const openOrder = (params = {}): UIOrder => {
    return uiOrder({
        status: OrderStatus.Fillable,
        ...params,
    });
};

export const closedOrder = (params = {}): UIOrder => {
    return uiOrder({
        status: OrderStatus.FullyFilled,
        ...params,
    });
};
