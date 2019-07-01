/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ThemeProvider } from 'styled-components';

import { OrderBookTableWithTheme } from '../../../../components/erc20/marketplace/order_book';
import { DefaultTheme } from '../../../../themes/default_theme';
import { openOrder, tokenFactory } from '../../../../util/test-utils';
import { OrderSide, Token, Web3State } from '../../../../util/types';

const mockStore = configureMockStore([]);

const theme = new DefaultTheme();

describe('OrderBookTable', () => {
    const absoluteSpread = new BigNumber('0.03');
    const percentageSpread = new BigNumber('3');

    it('Renders my size column with value', () => {
        // given
        const orderBook = {
            sellOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.02'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('4'),
                    price: new BigNumber('1.01'),
                },
            ],
            buyOrders: [
                {
                    side: OrderSide.Buy,
                    size: new BigNumber('2'),
                    price: new BigNumber('0.5'),
                },
            ],
            mySizeOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
            ],
        };

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <OrderBookTableWithTheme
                        orderBook={orderBook}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        userOrders={userOrders}
                        absoluteSpread={absoluteSpread}
                        percentageSpread={percentageSpread}
                    />
                </Provider>
            </ThemeProvider>
        );

        const tree = renderer.create(wrapper).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Should render a row of mySize with the total amount for one order', () => {
        // Given
        const orderBook = {
            sellOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('4'),
                    price: new BigNumber('1.01'),
                },
            ],
            buyOrders: [
                {
                    side: OrderSide.Buy,
                    size: new BigNumber('2'),
                    price: new BigNumber('0.5'),
                },
            ],
            mySizeOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
            ],
        };

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <OrderBookTableWithTheme
                        orderBook={orderBook}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        userOrders={userOrders}
                        percentageSpread={percentageSpread}
                        absoluteSpread={absoluteSpread}
                    />
                </Provider>
            </ThemeProvider>
        );

        const tree = renderer.create(wrapper).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Check if my size renders an item with more than two decimals', () => {
        // Given
        const orderBook = {
            sellOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.1234567'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.123456'),
                    price: new BigNumber('1.02'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.12345'),
                    price: new BigNumber('1.01'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.1234'),
                    price: new BigNumber('1.01'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.123'),
                    price: new BigNumber('1.01'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1.12'),
                    price: new BigNumber('1.01'),
                },
            ],
            buyOrders: [
                {
                    side: OrderSide.Buy,
                    size: new BigNumber('2'),
                    price: new BigNumber('0.5'),
                },
            ],
            mySizeOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
            ],
        };

        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <OrderBookTableWithTheme
                        orderBook={orderBook}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        userOrders={userOrders}
                        absoluteSpread={absoluteSpread}
                        percentageSpread={percentageSpread}
                    />
                </Provider>
            </ThemeProvider>
        );

        // then
        const tree = renderer.create(wrapper).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('Should not render my size column if the user does not have metamask', () => {
        const orderBook = {
            sellOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('4'),
                    price: new BigNumber('1.01'),
                },
            ],
            buyOrders: [
                {
                    side: OrderSide.Buy,
                    size: new BigNumber('2'),
                    price: new BigNumber('0.5'),
                },
            ],
            mySizeOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
            ],
        };

        const token: Token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
            primaryColor: '#ccc',
            displayDecimals: 2,
        };

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <OrderBookTableWithTheme
                        orderBook={orderBook}
                        baseToken={token}
                        quoteToken={token}
                        userOrders={userOrders}
                        web3State={Web3State.NotInstalled}
                        absoluteSpread={absoluteSpread}
                        percentageSpread={percentageSpread}
                    />
                </Provider>
            </ThemeProvider>
        );

        // then
        const tree = renderer.create(wrapper).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('Should not render my size column if the user rejected the metamask permissions', () => {
        const orderBook = {
            sellOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('4'),
                    price: new BigNumber('1.01'),
                },
            ],
            buyOrders: [
                {
                    side: OrderSide.Buy,
                    size: new BigNumber('2'),
                    price: new BigNumber('0.5'),
                },
            ],
            mySizeOrders: [
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
                {
                    side: OrderSide.Sell,
                    size: new BigNumber('1'),
                    price: new BigNumber('1.5'),
                },
            ],
        };

        const token: Token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
            primaryColor: '#ccc',
            displayDecimals: 2,
        };

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        const store = mockStore({});

        // when
        const wrapper = (
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <OrderBookTableWithTheme
                        orderBook={orderBook}
                        baseToken={token}
                        quoteToken={token}
                        userOrders={userOrders}
                        web3State={Web3State.Locked}
                        absoluteSpread={absoluteSpread}
                        percentageSpread={percentageSpread}
                    />
                </Provider>
            </ThemeProvider>
        );

        // then
        const tree = renderer.create(wrapper).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
