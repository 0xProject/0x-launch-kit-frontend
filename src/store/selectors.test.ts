import { BigNumber } from '0x.js';

import { closedOrder, openOrder } from '../util/test-utils';
import { UIOrderSide } from '../util/types';

import * as selectors from './selectors';

describe('selectors', () => {
    it('should get open orders', () => {
        // given
        const openOrder1 = openOrder();
        const openOrder2 = openOrder();
        const openOrder3 = openOrder();
        const state: any = {
            relayer: {
                orders: [openOrder1, openOrder2, closedOrder(), openOrder3],
            },
        };

        // when
        const result = selectors.getOpenOrders(state);

        // then
        expect(result).toEqual([openOrder1, openOrder2, openOrder3]);
    });

    it('should get open sell orders', () => {
        // given
        const openSellOrder1 = openOrder({ side: UIOrderSide.Sell });
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy });
        const openSellOrder2 = openOrder({ side: UIOrderSide.Sell });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openBuyOrder1, closedOrder(), openSellOrder2],
            },
        };

        // when
        const result = selectors.getOpenSellOrders(state);

        // then
        expect(result).toEqual([openSellOrder1, openSellOrder2]);
    });

    it('should sort open sell orders by price (desc)', () => {
        // given
        const openSellOrder1 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber(2) });
        const openSellOrder2 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber(3) });
        const openSellOrder3 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber(1) });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openSellOrder2, openSellOrder3],
            },
        };

        // when
        const result = selectors.getOpenSellOrders(state);

        // then
        expect(result).toEqual([openSellOrder2, openSellOrder1, openSellOrder3]);
    });

    it('should get open buy orders', () => {
        // given
        const openSellOrder1 = openOrder({ side: UIOrderSide.Sell });
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy });
        const openSellOrder2 = openOrder({ side: UIOrderSide.Sell });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openBuyOrder1, closedOrder(), openSellOrder2],
            },
        };

        // when
        const result = selectors.getOpenBuyOrders(state);

        // then
        expect(result).toHaveLength(1);
        expect(result).toEqual([openBuyOrder1]);
    });

    it('should sort open buy orders by price (desc)', () => {
        // given
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber(2) });
        const openBuyOrder2 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber(3) });
        const openBuyOrder3 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber(1) });
        const state: any = {
            relayer: {
                orders: [openBuyOrder1, openBuyOrder2, openBuyOrder3],
            },
        };

        // when
        const result = selectors.getOpenBuyOrders(state);

        // then
        expect(result).toEqual([openBuyOrder2, openBuyOrder1, openBuyOrder3]);
    });

    it('should get the spread between sell and buy orders', () => {
        // given
        const openSellOrder1 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.0') });
        const openSellOrder2 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.1') });
        const openSellOrder3 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.3') });
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.5') });
        const openBuyOrder2 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.3') });
        const openBuyOrder3 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.4') });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openSellOrder2, openSellOrder3, openBuyOrder1, openBuyOrder2, openBuyOrder3],
            },
        };

        // when
        const result = selectors.getSpread(state);

        // then
        expect(result).toEqual(new BigNumber('0.5'));
    });

    it('should return a spread of 0 if there are no sell orders', () => {
        // given
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.5') });
        const openBuyOrder2 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.3') });
        const openBuyOrder3 = openOrder({ side: UIOrderSide.Buy, price: new BigNumber('7.4') });
        const state: any = {
            relayer: {
                orders: [openBuyOrder1, openBuyOrder2, openBuyOrder3],
            },
        };

        // when
        const result = selectors.getSpread(state);

        // then
        expect(result).toEqual(new BigNumber('0'));
    });

    it('should return a spread of 0 if there are no buy orders', () => {
        // given
        const openSellOrder1 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.0') });
        const openSellOrder2 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.1') });
        const openSellOrder3 = openOrder({ side: UIOrderSide.Sell, price: new BigNumber('8.3') });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openSellOrder2, openSellOrder3],
            },
        };

        // when
        const result = selectors.getSpread(state);

        // then
        expect(result).toEqual(new BigNumber('0'));
    });

    it('should return the order book', () => {
        // given
        const openSellOrder1 = openOrder({
            side: UIOrderSide.Sell,
            size: new BigNumber(1),
            price: new BigNumber('8.0'),
        });
        const openSellOrder2 = openOrder({
            side: UIOrderSide.Sell,
            size: new BigNumber(1),
            price: new BigNumber('8.1'),
        });
        const openSellOrder3 = openOrder({
            side: UIOrderSide.Sell,
            size: new BigNumber(1),
            price: new BigNumber('8.0'),
        });
        const openBuyOrder1 = openOrder({ side: UIOrderSide.Buy, size: new BigNumber(1), price: new BigNumber('7.5') });
        const openBuyOrder2 = openOrder({ side: UIOrderSide.Buy, size: new BigNumber(1), price: new BigNumber('7.3') });
        const openBuyOrder3 = openOrder({ side: UIOrderSide.Buy, size: new BigNumber(1), price: new BigNumber('7.3') });
        const state: any = {
            relayer: {
                orders: [openSellOrder1, openSellOrder2, openSellOrder3, openBuyOrder1, openBuyOrder2, openBuyOrder3],
            },
        };

        // when
        const result = selectors.getOrderBook(state);

        // then
        expect(result).toEqual({
            sellOrders: [
                { side: UIOrderSide.Sell, size: new BigNumber(1), price: new BigNumber('8.1') },
                { side: UIOrderSide.Sell, size: new BigNumber(2), price: new BigNumber('8.0') },
            ],
            buyOrders: [
                { side: UIOrderSide.Buy, size: new BigNumber(1), price: new BigNumber('7.5') },
                { side: UIOrderSide.Buy, size: new BigNumber(2), price: new BigNumber('7.3') },
            ],
            spread: new BigNumber('0.5'),
        });
    });
});
