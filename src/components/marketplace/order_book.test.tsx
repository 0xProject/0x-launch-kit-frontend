import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import { openOrder } from '../../util/test-utils';
import { OrderSide } from '../../util/types';

import { OrderBookTable } from './order_book';

describe('OrderBookTable', () => {
    it('Renders my size column with value', () => {
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
            spread: new BigNumber('0.03'),
        };

        const token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
        };

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        // when
        const wrapper = mount(<OrderBookTable orderBook={orderBook} selectedToken={token} userOrders={userOrders} />);

        // then
        const mySizeRowValue = wrapper
            .find('tbody tr')
            .at(0)
            .find('td')
            .at(1);
        expect(mySizeRowValue.text()).toEqual('1.00');
    });
    it('Should render a row of mySize with the total amount for one order', () => {
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
            spread: new BigNumber('0.03'),
        };

        const token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
        };

        const userOrder1 = openOrder({
            side: OrderSide.Buy,
            size: new BigNumber(2),
            price: new BigNumber('0.5'),
        });

        const userOrders = [userOrder1];

        // when
        const wrapper = mount(<OrderBookTable orderBook={orderBook} selectedToken={token} userOrders={userOrders} />);

        // then
        const mySizeRowValue = wrapper
            .find('tbody tr')
            .at(0)
            .find('td')
            .at(1);
        expect(mySizeRowValue.text()).toEqual('2.00');
    });
});
