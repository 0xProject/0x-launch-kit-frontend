import { ExchangeFillEventArgs } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { buildFill } from '../../util/fills';
import { getKnownTokens } from '../../util/known_tokens';
import { marketToStringFromTokens } from '../../util/markets';
import { addressFactory } from '../../util/test-utils';
import { Market, OrderSide } from '../../util/types';

describe('buildFillFromEvent', () => {
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

    it('should create a fill', () => {
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
            makerFeeAssetData: '0x',
            takerFeeAssetData: '0x',
            protocolFeePaid: new BigNumber(0),
        };
        const log: any = {
            args,
            transactionHash: '',
        };

        // when
        const fill = buildFill(log, knownTokens, markets);

        // then
        expect(fill.amountQuote).toEqual(new BigNumber(1));
        expect(fill.amountBase).toEqual(new BigNumber(2));
        expect(fill.price).toEqual(args.takerAssetFilledAmount.div(args.makerAssetFilledAmount).toString());
        expect(fill.side).toEqual(OrderSide.Buy);
        expect(fill.market).toEqual(marketToStringFromTokens(zrxToken, wethToken));
    });
});
