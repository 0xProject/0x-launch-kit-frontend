import { BigNumber } from '0x.js';

import * as dollarUtils from './market_prices';
import { buildLimitOrder, buildMarketOrders, orderDetailsFeeDollar, orderDetailsFeeEther } from './orders';
import { uiOrder } from './test-utils';
import { OrderSide } from './types';

describe('buildLimitOrder', () => {
    it('should build a buy order', async () => {
        // given
        const account = '0x0000000000000000000000000000000000000001';
        const tokenAddress = '0x0000000000000000000000000000000000000002';
        const wethAddress = '0x0000000000000000000000000000000000000003';
        const exchangeAddress = '0x0000000000000000000000000000000000000004';
        const amount = new BigNumber('100');
        const price = new BigNumber(0.1);

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
        const price = new BigNumber(0.1);

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
describe('orderDetails', () => {
    it('orderDetailsFeeEther should calculate totalFee for buy order ', () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(1);
        const orderType = OrderSide.Buy;
        const MAKER_FEE = '0.1';
        const TAKER_FEE = '0.05';

        // when
        const orderInEther = orderDetailsFeeEther(makerAmount, takerAmount, orderType, MAKER_FEE, TAKER_FEE);

        // then
        const resultExpected = new BigNumber(0.75);
        expect(orderInEther.eq(resultExpected)).toBe(true);
    });
    it('orderDetailsFeeEther should calculate totalFee for sell order ', () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(1);
        const orderType = OrderSide.Sell;
        const MAKER_FEE = '0.1';
        const TAKER_FEE = '0.05';

        // when
        const orderInEther = orderDetailsFeeEther(makerAmount, takerAmount, orderType, MAKER_FEE, TAKER_FEE);

        // then
        const resultExpected = new BigNumber(0.15);
        expect(orderInEther.eq(resultExpected)).toBe(true);
    });

    it('orderDetailsFeeDollar should calculate the ethPrice in USD ', async () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(1);
        const orderType = OrderSide.Sell;
        const MAKER_FEE = '0.1';
        const TAKER_FEE = '0.05';
        const DOLAR_PRICE = 10;
        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        // when
        const orderInDollar = await orderDetailsFeeDollar(makerAmount, takerAmount, orderType, MAKER_FEE, TAKER_FEE);
        const resultExpected = new BigNumber(1.5);

        // then
        expect(orderInDollar.eq(resultExpected)).toBe(true);
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
        const [, , canBeFilled] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(canBeFilled).toBe(true);
    });

    it('should indicate when the amount cannot be filled', async () => {
        // given
        const amount = new BigNumber(10);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [, , canBeFilled] = buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(canBeFilled).toBe(false);
    });

    it('should round amounts up', () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.01'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(4) }),
        ];

        // when
        const [ordersToFill, amounts] = buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(4), new BigNumber(4)]);
    });
});
