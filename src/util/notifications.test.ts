import { assetDataUtils, BigNumber, ExchangeFillEventArgs } from '0x.js';

import { getKnownTokens } from './known_tokens';
import { buildOrderFilledNotification } from './notifications';
import { addressFactory } from './test-utils';
import { OrderSide, TokenSymbol } from './types';
const wethToken = {
    decimals: 18,
    symbol: TokenSymbol.Weth,
    name: 'Wrapped Ether',
    primaryColor: '#3333ff',
    addresses: {
        1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        50: '0x0b1ba0af832d7c05fd64161e0db78e85978e8082',
    },
};
const zrxToken = {
    decimals: 18,
    symbol: TokenSymbol.Zrx,
    name: '0x',
    primaryColor: '#333333',
    addresses: {
        1: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
        42: '0x2002d3812f58e35f0ea1ffbf80a75a38c32175fa',
        50: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
    },
};
const markets = [
    {
        price: null,
        currencyPair: {
            base: TokenSymbol.Zrx,
            quote: TokenSymbol.Weth,
        },
    },
    {
        price: null,
        currencyPair: {
            base: TokenSymbol.Mkr,
            quote: TokenSymbol.Weth,
        },
    },
    {
        price: null,
        currencyPair: {
            base: TokenSymbol.Zrx,
            quote: TokenSymbol.Mkr,
        },
    },
];
const networkId = 50;
const knownTokens = getKnownTokens(networkId);
describe('buildOrderFilledNotification', () => {
    it('should create a notification for a fill of a buy order', () => {
        // given
        const baseTokenAddress = assetDataUtils.encodeERC20AssetData(zrxToken.addresses[50]);
        const quoteTokenAddress = assetDataUtils.encodeERC20AssetData(wethToken.addresses[50]);
        const args: ExchangeFillEventArgs = {
            feeRecipientAddress: addressFactory.build().address,
            makerAddress: addressFactory.build().address,
            takerAddress: addressFactory.build().address,
            senderAddress: addressFactory.build().address,
            makerAssetFilledAmount: new BigNumber(2),
            takerAssetFilledAmount: new BigNumber(1),
            makerFeePaid: new BigNumber(0),
            takerFeePaid: new BigNumber(0),
            orderHash: '',
            makerAssetData: baseTokenAddress,
            takerAssetData: quoteTokenAddress,
        };

        const log: any = {
            args,
            transactionHash: '',
        };
        // when
        const notification = buildOrderFilledNotification(log, knownTokens, markets);
        // then
        expect(notification.amount).toEqual(new BigNumber(1));
        expect(notification.side).toEqual(OrderSide.Buy);
    });

    it('should create a notification for a fill of a sell order', () => {
        const baseTokenAddress = assetDataUtils.encodeERC20AssetData(zrxToken.addresses[50]);
        const quoteTokenAddress = assetDataUtils.encodeERC20AssetData(wethToken.addresses[50]);
        // given
        const args: ExchangeFillEventArgs = {
            feeRecipientAddress: addressFactory.build().address,
            makerAddress: addressFactory.build().address,
            takerAddress: addressFactory.build().address,
            senderAddress: addressFactory.build().address,
            makerAssetFilledAmount: new BigNumber(2),
            takerAssetFilledAmount: new BigNumber(1),
            makerFeePaid: new BigNumber(0),
            takerFeePaid: new BigNumber(0),
            orderHash: '',
            makerAssetData: quoteTokenAddress,
            takerAssetData: baseTokenAddress,
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const notification = buildOrderFilledNotification(log, knownTokens, markets);

        // then
        expect(notification.amount).toEqual(new BigNumber(2));
        expect(notification.side).toEqual(OrderSide.Sell);
    });
});
