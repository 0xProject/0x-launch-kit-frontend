import { BigNumber } from '0x.js';

import { buildOrder, orderDetailsFeeDollar, orderDetailsFeeEther } from './orders';
import { OrderSide } from './types';

describe('buildOrder', () => {
    it('should build a buy order', async () => {
        // given
        const account = '0x0000000000000000000000000000000000000001';
        const tokenAddress = '0x0000000000000000000000000000000000000002';
        const wethAddress = '0x0000000000000000000000000000000000000003';
        const exchangeAddress = '0x0000000000000000000000000000000000000004';
        const amount = new BigNumber('100');
        const price = 0.1;

        // when
        const order = buildOrder(
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
        const order = buildOrder(
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
    it('orderDetailsFeeEther should return a BigNumber ', () => {
        // given
        const orderPrice = new BigNumber('1');
        const orderType = OrderSide.Buy;
        const decimals = 18;

        // when
        const orderInEther = orderDetailsFeeEther(orderPrice, orderType, decimals);

        // then
        expect(orderInEther).toBeInstanceOf(BigNumber);
    });
    it('orderDetailsFeeEther should calculate totalFee ', () => {
        // given
        const orderPrice = new BigNumber('1000000000000000000');
        const orderPrice2 = new BigNumber('5000000000000000000');
        const orderPrice3 = new BigNumber('1800000000000000000');
        const orderPrice4 = new BigNumber('20000000000000000000');
        const orderType = OrderSide.Buy;

        // when
        const orderInEther = orderDetailsFeeEther(orderPrice, orderType);
        const orderInEther2 = orderDetailsFeeEther(orderPrice2, orderType);
        const orderInEther3 = orderDetailsFeeEther(orderPrice3, orderType);
        const orderInEther4 = orderDetailsFeeEther(orderPrice4, orderType);

        const resultExpected1 = new BigNumber('0.01');
        const resultExpected2 = new BigNumber('0.05');
        const resultExpected3 = new BigNumber('0.018');
        const resultExpected4 = new BigNumber('0.2');

        // then
        expect(orderInEther.eq(resultExpected1)).toBe(true);
        expect(orderInEther2.eq(resultExpected2)).toBe(true);
        expect(orderInEther3.eq(resultExpected3)).toBe(true);
        expect(orderInEther4.eq(resultExpected4)).toBe(true);
    });
    it('orderDetailsFeeDollar should return a BigNumber ', async () => {
        // given
        const orderPrice = new BigNumber('1');
        const orderType = OrderSide.Buy;
        const decimals = 18;

        // when
        const orderInEther = await orderDetailsFeeDollar(orderPrice, orderType, decimals);

        // then
        expect(orderInEther).toBeInstanceOf(BigNumber);
    });
});
