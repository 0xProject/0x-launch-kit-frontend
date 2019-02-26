import { BigNumber } from '0x.js';

import { OrderSide } from '../util/types';

import { buildLimitOrder, buildMarketOrders } from './orders';
import { uiOrder } from './test-utils';

describe('buildLimitOrder', () => {
    it('should build a buy order', async () => {
        // given
        const account = '0x0000000000000000000000000000000000000001';
        const tokenAddress = '0x0000000000000000000000000000000000000002';
        const wethAddress = '0x0000000000000000000000000000000000000003';
        const exchangeAddress = '0x0000000000000000000000000000000000000004';
        const amount = new BigNumber('100');
        const price = 0.1;

        // when
        const order = buildLimitOrder(
            {
                account,
                tokenAddress,
                wethAddress,
                amount,
                price,
                exchangeAddress,
            },
            OrderSide.Buy,
        );

        // then
        expect(order.exchangeAddress).toEqual(exchangeAddress);
        expect(order.makerAddress).toEqual(account);
        expect(order.makerAssetAmount).toEqual(new BigNumber('10'));
        expect(order.makerAssetData).toEqual(
            '0xf47261b00000000000000000000000000000000000000000000000000000000000000003',
        );
        expect(order.takerAddress).toEqual('0x0000000000000000000000000000000000000000');
        expect(order.takerAssetAmount).toEqual(new BigNumber('100'));
        expect(order.takerAssetData).toEqual(
            '0xf47261b00000000000000000000000000000000000000000000000000000000000000002',
        );
    });

    it('should build a sell order', async () => {
        // given
        const account = '0x0000000000000000000000000000000000000001';
        const tokenAddress = '0x0000000000000000000000000000000000000002';
        const wethAddress = '0x0000000000000000000000000000000000000003';
        const exchangeAddress = '0x0000000000000000000000000000000000000004';
        const amount = new BigNumber('100');
        const price = 0.1;

        // when
        const order = buildLimitOrder(
            {
                account,
                tokenAddress,
                wethAddress,
                amount,
                price,
                exchangeAddress,
            },
            OrderSide.Sell,
        );

        // then
        expect(order.exchangeAddress).toEqual(exchangeAddress);
        expect(order.makerAddress).toEqual(account);
        expect(order.makerAssetAmount).toEqual(new BigNumber('100'));
        expect(order.makerAssetData).toEqual(
            '0xf47261b00000000000000000000000000000000000000000000000000000000000000002',
        );
        expect(order.takerAddress).toEqual('0x0000000000000000000000000000000000000000');
        expect(order.takerAssetAmount).toEqual(new BigNumber('10'));
        expect(order.takerAssetData).toEqual(
            '0xf47261b00000000000000000000000000000000000000000000000000000000000000003',
        );
    });
});

describe('buildMarketOrders', () => {
    it('should fill one order and partially fill another', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(4) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(2)]);
    });

    it('should take price into account', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(4) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
    });

    it('should sort buy orders before filling them', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(4) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[1].rawOrder, orders[0].rawOrder]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
    });

    it('should sort sell orders before filling them', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(4) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(ordersToFill).toEqual([orders[1].rawOrder, orders[0].rawOrder]);
        expect(amounts).toEqual([new BigNumber(4), new BigNumber(1)]);
    });

    it('work when only one order is enough', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(ordersToFill).toEqual([orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(5)]);
    });

    it('should indicate when the amount can be filled', async () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [, , filled] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(filled).toBe(true);
    });

    it('should indicate when the amount cannot be filled', async () => {
        // given
        const amount = new BigNumber(10);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [, , filled] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(filled).toBe(false);
    });
});
