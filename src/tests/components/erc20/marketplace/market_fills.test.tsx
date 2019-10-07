/**
 * @jest-environment jsdom
 */

import { assetDataUtils, BigNumber, ExchangeFillEventArgs } from '0x.js';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import { CustomTD } from '../../../../components/common/table';
import { MarketFills, SideTD } from '../../../../components/erc20/marketplace/market_fills';
import { buildFill } from '../../../../util/fills';
import { getKnownTokens, isWeth } from '../../../../util/known_tokens';
import { marketToString } from '../../../../util/markets';
import { addressFactory, getCurrencyPairFromTokens } from '../../../../util/test-utils';
import { tokenAmountInUnits } from '../../../../util/tokens';
import { Market, MarketFill } from '../../../../util/types';

describe('MarketFills', () => {
    const getTextCustomTDFromWrapper = (wrapper: ShallowWrapper, element = 0): string =>
        wrapper
            .find(CustomTD)
            .at(element)
            .text();

    const getTextSideFromWrapper = (wrapper: ShallowWrapper): string =>
        wrapper
            .find(SideTD)
            .at(0)
            .text();

    const marketData = {
        spreadInPercentage: new BigNumber(1),
        bestAsk: new BigNumber(1),
        bestBid: new BigNumber(1),
    };

    const config = {
        basePrecision: 8,
        pricePrecision: 8,
        quotePrecision: 8,
        minAmount: 0,
        maxAmount: 1000000,
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

    it('Display all market fill row from fill', () => {
        // given
        const knownTokens = getKnownTokens();
        const zrxToken = knownTokens.getTokenBySymbol('zrx');
        const wethToken = knownTokens.getWethToken();

        const baseToken = zrxToken;
        const quoteToken = wethToken;
        const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(zrxToken.address);
        const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(wethToken.address);
        const currencyPairFromTokens = getCurrencyPairFromTokens(baseToken, quoteToken);
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
        const changeMarket = jest.fn();
        const goToHome = jest.fn();

        // when
        const fill = buildFill(log, knownTokens, markets);

        const market = marketToString(currencyPairFromTokens);

        const marketFill: MarketFill = {};
        marketFill[market] = [fill];

        // when
        const wrapper = shallow(
            <MarketFills
                baseToken={baseToken}
                quoteToken={quoteToken}
                marketFills={marketFill}
                changeMarket={changeMarket}
                goToHome={goToHome}
            />,
        );
        const sideText = getTextSideFromWrapper(wrapper);
        expect(sideText).toEqual('Buy');
        const price = getTextCustomTDFromWrapper(wrapper);
        expect(price).toEqual(parseFloat(fill.price.toString()).toFixed(5));
        const amountBaseText = getTextCustomTDFromWrapper(wrapper, 1);
        const amountBase = tokenAmountInUnits(fill.amountBase, fill.tokenBase.decimals, fill.tokenBase.displayDecimals);
        expect(amountBaseText).toEqual(`${amountBase} ${fill.tokenBase.symbol.toUpperCase()}`);
        const amountQuoteText = getTextCustomTDFromWrapper(wrapper, 2);
        const amountQuote = tokenAmountInUnits(
            fill.amountQuote,
            fill.tokenQuote.decimals,
            fill.tokenQuote.displayDecimals,
        );
        const tokenQuoteSymbol = isWeth(fill.tokenQuote.symbol) ? 'ETH' : fill.tokenQuote.symbol.toUpperCase();
        const displayAmountQuote = `${amountQuote} ${tokenQuoteSymbol}`;
        expect(amountQuoteText).toEqual(displayAmountQuote);
    });
});
