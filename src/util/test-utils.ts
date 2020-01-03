import { SignedOrder } from '@0x/connect';
import { ExchangeFillEventArgs } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { OrderStatus } from '@0x/types';
import { BigNumber, NULL_BYTES } from '@0x/utils';
import * as Factory from 'factory.ts';

import { CHAIN_ID, ZERO } from '../common/constants';
import { TokenMetaData } from '../common/tokens_meta_data';

import { buildFill } from './fills';
import { getKnownTokens } from './known_tokens';
import { Collectible, CurrencyPair, Market, OrderSide, Token, TokenBalance, UIOrder } from './types';

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
        makerFee: ZERO,
        takerFee: ZERO,
        makerFeeAssetData: NULL_BYTES,
        takerFeeAssetData: NULL_BYTES,
        chainId: CHAIN_ID,
        signature: '',
    };
};

export const uiOrder = (params = {}): UIOrder => {
    const rawOrder: any = {};
    return {
        filled: ZERO,
        price: new BigNumber(1),
        rawOrder,
        side: OrderSide.Sell,
        size: new BigNumber(1),
        status: OrderStatus.Fillable,
        ...params,
    };
};

export const getCurrencyPairFromTokens = (base: Token, quote: Token): CurrencyPair => ({
    base: base.symbol.toLowerCase(),
    quote: quote.symbol.toLowerCase(),
    config: {
        basePrecision: 4,
        pricePrecision: 4,
        quotePrecision: 4,
        minAmount: 0,
        maxAmount: 1000000,
    },
});

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

export const createFill = (
    makerAssetFilledAmount: BigNumber = new BigNumber(2),
    takerAssetFilledAmount: BigNumber = new BigNumber(1),
) => {
    const knownTokens = getKnownTokens();
    const zrxToken = knownTokens.getTokenBySymbol('zrx');
    const wethToken = knownTokens.getWethToken();

    // ZRX/WETH
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(zrxToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);
    const config = {
        basePrecision: 8,
        pricePrecision: 8,
        quotePrecision: 8,
        minAmount: 0,
        maxAmount: 1000000,
    };
    const marketData = {
        spreadInPercentage: new BigNumber(1),
        bestAsk: new BigNumber(1),
        bestBid: new BigNumber(1),
    };

    const markets: Market[] = [
        {
            price: null,
            currencyPair: {
                base: 'zrx',
                quote: 'weth',
                config,
            },
            ...marketData,
        },
        {
            price: null,
            currencyPair: {
                base: 'mkr',
                quote: 'weth',
                config,
            },
            ...marketData,
        },
        {
            price: null,
            currencyPair: {
                base: 'zrx',
                quote: 'mkr',
                config,
            },
            ...marketData,
        },
    ];

    const args: ExchangeFillEventArgs = {
        feeRecipientAddress: addressFactory.build().address,
        makerAddress: addressFactory.build().address,
        takerAddress: addressFactory.build().address,
        senderAddress: addressFactory.build().address,
        makerAssetFilledAmount,
        takerAssetFilledAmount,
        makerFeePaid: new BigNumber(0),
        takerFeePaid: new BigNumber(0),
        orderHash: '',
        makerAssetData: baseTokenAssetData,
        takerAssetData: quoteTokenAssetData,
        makerFeeAssetData: NULL_BYTES,
        takerFeeAssetData: NULL_BYTES,
        protocolFeePaid: ZERO,
    };
    const log: any = {
        args,
        transactionHash: '',
    };

    return buildFill(log, knownTokens, markets);
};
