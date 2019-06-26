import { assetDataUtils, BigNumber, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';
import * as Factory from 'factory.ts';

import { TokenMetaData } from '../common/tokens_meta_data';

import { Collectible, OrderSide, Token, TokenBalance, UIOrder } from './types';

export const makeOrder = ({
    makerAssetAmount,
    takerAssetAmount,
    makerTokenAddress,
    takerTokenAddress,
}: {
    makerAssetAmount: string;
    takerAssetAmount: string;
    makerTokenAddress: string;
    takerTokenAddress: string;
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
        makerAssetData: assetDataUtils.encodeERC20AssetData(makerTokenAddress),
        takerAssetData: assetDataUtils.encodeERC20AssetData(takerTokenAddress),
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber('0'),
        signature: '',
    };
};

export const uiOrder = (params = {}): UIOrder => {
    const rawOrder: any = {};
    return {
        filled: new BigNumber(0),
        price: new BigNumber(1),
        rawOrder,
        side: OrderSide.Sell,
        size: new BigNumber(1),
        status: OrderStatus.Fillable,
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

const repeat = (x: any, times: number) => [...Array(times)].map(() => x);

export const addressFactory = Factory.Sync.makeFactory<{ address: string }>({
    address: Factory.each((i: number) => {
        const prefix = '0x';
        const zeros = repeat('0', 39 - Math.floor(Math.log(i + 1) / Math.log(10))).join('');
        const suffix = (i + 1).toString();

        return `${prefix}${zeros}${suffix}`;
    }),
});

export const tokenFactory = Factory.Sync.makeFactory<Token>({
    address: Factory.each(() => addressFactory.build().address),
    decimals: 0,
    displayDecimals: 2,
    name: Factory.each(i => `Mock Token ${i}`),
    primaryColor: '#ff0000',
    // @ts-ignore
    symbol: Factory.each(i => `MOCK${i}`),
    icon: undefined,
});

export const tokenMetaDataFactory = Factory.Sync.makeFactory<TokenMetaData>({
    addresses: Factory.each(() => ({
        50: addressFactory.build().address,
    })),
    decimals: 0,
    name: Factory.each(i => `Mock Token ${i}`),
    primaryColor: '#ff0000',
    // @ts-ignore
    symbol: Factory.each(i => `MOCK${i}`),
    icon: '',
});

export const tokenBalanceFactory = Factory.Sync.makeFactory<TokenBalance>({
    balance: new BigNumber(2),
    isUnlocked: true,
    token: tokenFactory.build(),
});

export const collectibleFactory = Factory.Sync.makeFactory<Collectible>({
    assetUrl: '',
    color: '',
    currentOwner: addressFactory.build().address,
    description: Factory.each(i => `Mocked collectible ${i}`),
    image: '',
    name: Factory.each(i => `NFT ${i}`),
    order: null,
    tokenId: Factory.each(i => i.toString()),
});
