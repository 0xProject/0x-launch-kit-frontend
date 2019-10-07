/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { MarketsList } from '../../../../components/erc20/common/markets_list';
import { DefaultTheme } from '../../../../themes/default_theme';
import { getCurrencyPairFromTokens, tokenFactory } from '../../../../util/test-utils';
import { Web3State } from '../../../../util/types';

const mockStore = configureMockStore([]);

const theme = new DefaultTheme();

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

const marketExamples = {
    zrxWeth: {
        currencyPair: {
            base: 'zrx',
            quote: 'weth',
            config,
        },
        price: null,
        ...marketData,
    },
    wethZrx: {
        currencyPair: {
            base: 'weth',
            quote: 'zrx',
            config,
        },
        price: null,
        ...marketData,
    },
    daiMkr: {
        currencyPair: {
            base: 'dai',
            quote: 'mkr',
            config,
        },
        price: null,
        ...marketData,
    },
    daiWeth: {
        currencyPair: {
            base: 'dai',
            quote: 'weth',
            config,
        },
        price: null,
        ...marketData,
    },
};
const { zrxWeth, wethZrx, daiWeth } = marketExamples;

describe('MarketsList', () => {
    it('Renders market list', () => {
        const markets = [zrxWeth, wethZrx, daiWeth];

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = getCurrencyPairFromTokens(baseToken, quoteToken);
        const changeMarket = jest.fn();
        const goToHome = jest.fn();

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <MarketsList
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        currencyPair={currencyPair}
                        changeMarket={changeMarket}
                        goToHome={goToHome}
                        markets={markets}
                    />
                </Provider>
            </ThemeProvider>
        );

        const tree = renderer.create(wrapper).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Should not render markets list if the user does not have metamask', () => {
        const markets = [zrxWeth, wethZrx, daiWeth];

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = getCurrencyPairFromTokens(baseToken, quoteToken);
        const changeMarket = jest.fn();
        const goToHome = jest.fn();

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <MarketsList
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        currencyPair={currencyPair}
                        changeMarket={changeMarket}
                        web3State={Web3State.NotInstalled}
                        goToHome={goToHome}
                        markets={markets}
                    />
                </Provider>
            </ThemeProvider>
        );

        const tree = renderer.create(wrapper).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Should not render markets list if the user rejected the metamask permissions', () => {
        const markets = [zrxWeth, wethZrx, daiWeth];

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = getCurrencyPairFromTokens(baseToken, quoteToken);
        const changeMarket = jest.fn();
        const goToHome = jest.fn();

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <MarketsList
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        currencyPair={currencyPair}
                        changeMarket={changeMarket}
                        web3State={Web3State.Locked}
                        goToHome={goToHome}
                        markets={markets}
                    />
                </Provider>
            </ThemeProvider>
        );

        const tree = renderer.create(wrapper).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
