import { BigNumber, OrderInfo, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { getKnownTokens } from '../../util/known_tokens';
import { makeOrder, uiOrder } from '../../util/test-utils';
import { OrderSide, UIOrder } from '../../util/types';
import { mergeByPrice, ordersToUIOrders } from '../../util/ui_orders';

describe('ordersToUIOrders', () => {
    const ZrxToken = getKnownTokens().getTokenBySymbol('zrx');
    const WethToken = getKnownTokens().getTokenBySymbol('weth');

    it('should convert a sell Order to a UIOrder', async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
                makerTokenAddress: baseToken.address,
                takerTokenAddress: quoteToken.address,
            }),
        ];
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: OrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
        });
    });

    it('should convert a buy Order to a UIOrder', async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
                makerTokenAddress: quoteToken.address,
                takerTokenAddress: baseToken.address,
            }),
        ];
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: OrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
        });
    });

    it('should convert buy and sell Orders to UIOrders', async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
                makerTokenAddress: baseToken.address,
                takerTokenAddress: quoteToken.address,
            }),
            makeOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
                makerTokenAddress: quoteToken.address,
                takerTokenAddress: baseToken.address,
            }),
        ];
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
        const uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(uiOrders).toHaveLength(2);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: OrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
        });
        expect(uiOrders[1]).toEqual({
            rawOrder: orders[1],
            side: OrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
        });
    });

    it('should convert a partially filled sell Order to a UIOrder', async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '50',
                makerTokenAddress: baseToken.address,
                takerTokenAddress: quoteToken.address,
            }),
        ];
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('25'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: OrderSide.Sell,
            size: new BigNumber('1'),
            filled: new BigNumber('0.5'),
            price: new BigNumber('50'),
            status: OrderStatus.Fillable,
        });
    });

    it('should convert a partially filled buy Order to a UIOrder', async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
                makerTokenAddress: quoteToken.address,
                takerTokenAddress: baseToken.address,
            }),
        ];
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0.75'),
            },
        ];

        // when
        const uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: OrderSide.Buy,
            size: new BigNumber('1'),
            filled: new BigNumber('0.75'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
        });
    });

    it("should throw if orders length and ordersInfo length don't match", async () => {
        // given
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const orders: SignedOrder[] = [
            makeOrder({
                makerAssetAmount: '1',
                takerAssetAmount: '100',
                makerTokenAddress: quoteToken.address,
                takerTokenAddress: baseToken.address,
            }),
            makeOrder({
                makerAssetAmount: '100',
                takerAssetAmount: '1',
                makerTokenAddress: baseToken.address,
                takerTokenAddress: quoteToken.address,
            }),
        ];
        const ordersInfo: OrderInfo[] = [
            {
                orderHash: '',
                orderStatus: OrderStatus.Fillable,
                orderTakerAssetFilledAmount: new BigNumber('0'),
            },
        ];

        // when
        const functionCall = () => ordersToUIOrders(orders, baseToken, ordersInfo);

        // then
        expect(functionCall).toThrow();
    });
});

describe('mergeByPrice', () => {
    it('should group orders with the same price', async () => {
        // given
        const orders = [
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('3.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('4.00'),
            },
        ].map(uiOrder);

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([
            {
                side: OrderSide.Sell,
                size: new BigNumber('8.00'),
                price: new BigNumber('1.00'),
            },
            {
                side: OrderSide.Sell,
                size: new BigNumber('4.00'),
                price: new BigNumber('1.01'),
            },
        ]);
    });

    it('should return the same list if all prices are different', async () => {
        // given
        const orders = [
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('3.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('4.00'),
            },
        ].map(uiOrder);

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('3.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('4.00'),
            },
        ]);
    });
    it('should take the filled values into account', async () => {
        // given
        const orders = [
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('5.00'),
                filled: new BigNumber('1.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('3.00'),
                filled: new BigNumber('1.50'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('4.00'),
                filled: new BigNumber('0.75'),
            },
        ].map(uiOrder);

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.00'),
                size: new BigNumber('4.00'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.01'),
                size: new BigNumber('1.50'),
            },
            {
                side: OrderSide.Sell,
                price: new BigNumber('1.02'),
                size: new BigNumber('3.25'),
            },
        ]);
    });

    it('should work with an empty list', async () => {
        // given
        const orders: UIOrder[] = [];

        // when
        const result = mergeByPrice(orders);

        // then
        expect(result).toEqual([]);
    });
});
