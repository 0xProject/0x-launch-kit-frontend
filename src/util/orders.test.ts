import { BigNumber } from '0x.js';

import * as dollarUtils from './market_prices';
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
    it('orderDetailsFeeEther should calculate totalFee for buy order ', () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(500000000000000000);
        const orderType = OrderSide.Buy;
        const MAKER_FEE = '0.1';
        const TAKER_FEE = '0.05';

        // when
        const orderInEther = orderDetailsFeeEther(makerAmount, takerAmount, orderType, MAKER_FEE, TAKER_FEE);

        // then
        const resultExpected = new BigNumber(75000000000000000);

        expect(orderInEther.eq(resultExpected)).toBe(true);
    });
    it('orderDetailsFeeEther should calculate totalFee for sell order ', () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(500000000000000000);
        const orderType = OrderSide.Sell;
        const MAKER_FEE = '0.1';
        const TAKER_FEE = '0.05';

        // when
        const orderInEther = orderDetailsFeeEther(makerAmount, takerAmount, orderType, MAKER_FEE, TAKER_FEE);

        // then
        const resultExpected = new BigNumber(0.75);
        expect(orderInEther.eq(resultExpected)).toBe(true);
    });

    it('orderDetailsFeeDollar should calculate the ethPrice in USD ', async () => {
        // given
        const makerAmount = new BigNumber(5000000000000000000);
        const takerAmount = new BigNumber(500000000000000000);
        const orderType = OrderSide.Buy;
        const DOLAR_PRICE = 10;
        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        // when
        const orderInDollar = await orderDetailsFeeDollar(makerAmount, takerAmount, orderType);
        const resultExpected = new BigNumber(750000000000000000);

        // then
        expect(orderInDollar.eq(resultExpected)).toBe(true);
    });
});
