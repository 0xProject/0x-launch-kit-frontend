import { BigNumber, OrderInfo, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { makeBuyOrder, makeSellOrder, mockToken1 } from './test-utils';
import { OrderBookItem, UIOrderSide } from './types';
import { mergeByPrice, ordersToUIOrders } from './ui_orders';

describe('ordersToUIOrders', () => {
    it('should convert a sell Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [
            makeSellOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('1'),
        });
    });

    it('should convert a buy Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [
            makeBuyOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('1'),
        });
    });

    it('should convert buy and sell Orders to UIOrders', async () => {
        // given
        const orders: SignedOrder[] = [
            makeSellOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
            }),
            makeBuyOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(2);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('1'),
        });
        expect(uiOrders[1]).toEqual({
            rawOrder: orders[1],
            side: UIOrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('1'),
        });
    });

    it('should convert a partially filled sell Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [
            makeSellOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('25'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0.5'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('0.5'),
        });
    });

    it('should convert a partially filled buy Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [
            makeBuyOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0.75'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0.75'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
            emptySize: new BigNumber('0.25'),
        });
    });

    it("should throw if orders length and ordersInfo length don't match", async () => {
        // given
        const orders: SignedOrder[] = [
            makeBuyOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '100',
            }),
            makeSellOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
            }),
        ];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const functionCall = () => ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(functionCall).toThrow();
    });
});

describe('mergeByPrice', () => {
    it('should group orders with the same price', async () => {
        // given
        const orders = [
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
                emptySize: new BigNumber('8.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('3.00'),
                emptySize: new BigNumber('3.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('4.00'),
                emptySize: new BigNumber('4.00'),
            },
        ];

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([
            {
                side: UIOrderSide.Sell,
                size: new BigNumber('8.00'),
                price: new BigNumber('1.00'),
                emptySize: new BigNumber('8.00'),
            },
            {
                side: UIOrderSide.Sell,
                size: new BigNumber('4.00'),
                price: new BigNumber('1.01'),
                emptySize: new BigNumber('4.00'),
            },
        ]);
    });

    it('should return the same list if all prices are different', async () => {
        // given
        const orders = [
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
                emptySize: new BigNumber('5.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('3.00'),
                emptySize: new BigNumber('3.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('4.00'),
                emptySize: new BigNumber('4.00'),
            },
        ];

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
                emptySize: new BigNumber('5.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('3.00'),
                emptySize: new BigNumber('3.00'),
            },
            {
                side: UIOrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('4.00'),
                emptySize: new BigNumber('4.00'),
            },
        ]);
    });

    it('should work with an empty list', async () => {
        // given
        const orders: OrderBookItem[] = [];

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([]);
    });
});
