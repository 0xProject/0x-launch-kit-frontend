import { BigNumber } from '0x.js';

import { OrderSide } from '../util/types';

import { buildOrder } from './orders';

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
