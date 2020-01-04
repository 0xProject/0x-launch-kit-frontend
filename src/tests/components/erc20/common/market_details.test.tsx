/**
 * @jest-environment jsdom
 */

import { ExchangeFillEventArgs } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import { CustomTD } from '../../../../components/common/table';
import { MarketDetails } from '../../../../components/erc20/common/market_details';
import { buildFill } from '../../../../util/fills';
import { getKnownTokens } from '../../../../util/known_tokens';
import {
    getLastPrice,
    getTodayClosedOrdersFromFills,
    getTodayHighPriceFromFills,
    getTodayLowerPriceFromFills,
    getTodayVolumeFromFills,
} from '../../../../util/markets';
import { addressFactory, getCurrencyPairFromTokens } from '../../../../util/test-utils';
// import { tokenAmountInUnits } from '../../../../util/tokens';
import { Market } from '../../../../util/types';

describe('MarketDetails', () => {
    const getTextCustomTDFromWrapper = (wrapper: ShallowWrapper, element = 0): string =>
        wrapper
            .find(CustomTD)
            .at(element)
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
    // excluding test to not run on CI
    xit('Display all market details data related to base token and associated fill', () => {
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
            makerFeeAssetData: '0x',
            takerFeeAssetData: '0x',
            protocolFeePaid: new BigNumber(0),
        };
        const log: any = {
            args,
            transactionHash: '',
        };
        const changeMarket = jest.fn();
        const goToHome = jest.fn();

        // when
        const fill = buildFill(log, knownTokens, markets);
        const precision = currencyPairFromTokens.config.pricePrecision;
        // when
        const wrapper = shallow(
            <MarketDetails
                baseToken={baseToken}
                quoteToken={quoteToken}
                currencyPair={currencyPairFromTokens}
                highPrice={getTodayHighPriceFromFills([fill])}
                lowerPrice={getTodayLowerPriceFromFills([fill])}
                closedOrders={getTodayClosedOrdersFromFills([fill])}
                volume={getTodayVolumeFromFills([fill])}
                lastPrice={getLastPrice([fill])}
                changeMarket={changeMarket}
                goToHome={goToHome}
                windowWidth={1500}
            />,
        );

        const baseTokenName = getTextCustomTDFromWrapper(wrapper);
        expect(baseTokenName).toEqual(zrxToken.name);
        const lastPriceText = getTextCustomTDFromWrapper(wrapper, 1);
        expect(lastPriceText).toEqual(new BigNumber(fill.price).toFixed(precision));
        const highPriceText = getTextCustomTDFromWrapper(wrapper, 2);
        expect(highPriceText).toEqual(new BigNumber(fill.price).toFixed(precision));
        const lowerPriceText = getTextCustomTDFromWrapper(wrapper, 3);
        expect(lowerPriceText).toEqual(new BigNumber(fill.price).toFixed(precision));
        /* const volumeText = getTextCustomTDFromWrapper(wrapper, 4);
        expect(`${volumeText}  `).toEqual(
            `${tokenAmountInUnits(
                fill.amountBase,
                zrxToken.decimals,
                zrxToken.displayDecimals,
            ).toString()} ${zrxToken.symbol.toUpperCase()}`,
        );*/
        const closedOrders = getTextCustomTDFromWrapper(wrapper, 5);
        expect(closedOrders).toEqual('1');
    });
});
