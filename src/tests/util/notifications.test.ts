import { assetDataUtils, BigNumber, ExchangeFillEventArgs } from '0x.js';

import { getKnownTokens } from '../../util/known_tokens';
import { buildOrderFilledNotification } from '../../util/notifications';
import { addressFactory } from '../../util/test-utils';
import { OrderSide, TokenSymbol } from '../../util/types';

describe('buildOrderFilledNotification', () => {
    const networkId = 50;
    const knownTokens = getKnownTokens(networkId);
    const zrxToken = knownTokens.getTokenBySymbol(TokenSymbol.Zrx);
    const wethToken = knownTokens.getWethToken();

    // ZRX/WETH
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(zrxToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);

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

    it('should create a notification for a fill of a buy order', () => {
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
            makerAssetData: baseTokenAssetData,
            takerAssetData: quoteTokenAssetData,
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
            makerAssetData: quoteTokenAssetData,
            takerAssetData: baseTokenAssetData,
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
