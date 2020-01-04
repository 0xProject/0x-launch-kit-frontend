import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { getKnownTokens } from '../../util/known_tokens';
import * as utilOrders from '../../util/orders';
import { uiOrder } from '../../util/test-utils';
import { OrderSide } from '../../util/types';

describe('buildLimitMatchingOrders', () => {
    const ZrxToken = getKnownTokens().getTokenBySymbol('zrx');
    const WethToken = getKnownTokens().getTokenBySymbol('weth');

    const baseToken = ZrxToken;
    const quoteToken = WethToken;
    const baseTokenAddress = baseToken.address;
    const quoteTokenAddress = quoteToken.address;
    const basicRawOrder = {
        makerAssetData: assetDataUtils.encodeERC20AssetData(baseTokenAddress),
        takerAssetData: assetDataUtils.encodeERC20AssetData(quoteTokenAddress),
    };
    it('should fill one order and partially fill another', () => {
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const uiOrder1 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('1.0'),
            size: new BigNumber(3),
            rawOrder: rawOrder1,
        });
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(4),
        };
        const uiOrder2 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('1.0'),
            size: new BigNumber(4),
            rawOrder: rawOrder2,
        });

        // given
        const amount = new BigNumber(5);
        const price = new BigNumber('1.0');
        const orders = [uiOrder1, uiOrder2];

        // when
        const marketFill = utilOrders.buildMarketLimitMatchingOrders(
            { amount, price, orders: [uiOrder1, uiOrder2] },
            OrderSide.Buy,
        );

        // then
        expect(marketFill.orders).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(marketFill.amounts).toEqual([new BigNumber(3), new BigNumber(2)]);
    });

    it('should take price into account', () => {
        // given
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const uiOrder1 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('1.0'),
            size: new BigNumber(3),
            rawOrder: rawOrder1,
        });
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(8),
            takerAssetAmount: new BigNumber(4),
        };
        const uiOrder2 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('2.0'),
            size: new BigNumber(4),
            rawOrder: rawOrder2,
        });
        const orders = [uiOrder1, uiOrder2];

        // when
        const amount = new BigNumber(5);
        const price = new BigNumber('3.0');
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Buy);

        // then
        expect(marketFill.orders).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(marketFill.amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
    });

    it('should sort sell orders before filling them', () => {
        // given
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(2),
        };
        const uiOrder1 = uiOrder({
            side: OrderSide.Sell,
            price: new BigNumber('2.0'),
            size: new BigNumber(4),
            rawOrder: rawOrder1,
        });
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const uiOrder2 = uiOrder({
            side: OrderSide.Sell,
            price: new BigNumber('1.0'),
            size: new BigNumber(3),
            rawOrder: rawOrder2,
        });
        const orders = [uiOrder1, uiOrder2];

        // when
        const amount = new BigNumber(5);
        const price = new BigNumber('4');
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Buy);

        // then
        expect(marketFill.orders).toEqual([rawOrder2, rawOrder1]);
        expect(marketFill.amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
    });

    it('should sort buy orders before filling them', () => {
        // given
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const uiOrder1 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('1.0'),
            size: new BigNumber(3),
            rawOrder: rawOrder1,
        });
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(2),
        };
        const uiOrder2 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('2.0'),
            size: new BigNumber(4),
            rawOrder: rawOrder2,
        });
        const orders = [uiOrder1, uiOrder2];

        // when
        const amount = new BigNumber(5);
        const price = new BigNumber('0.5');
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Sell);

        // then
        expect(marketFill.orders).toEqual([rawOrder2, rawOrder1]);
        expect(marketFill.amounts).toEqual([new BigNumber(4), new BigNumber(1)]);
    });

    it('work when only one order is enough on sell and match must lower price order', () => {
        // given
        const amount = new BigNumber(3);
        const price = new BigNumber('0.5');
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(2),
        };
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3), rawOrder: rawOrder1 }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(4), rawOrder: rawOrder2 }),
        ];

        // when

        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Sell);

        // then
        expect(marketFill.orders).toEqual([orders[0].rawOrder]);
        expect(marketFill.amounts).toEqual([new BigNumber(3)]);
    });

    it('work when only one order is enough on buy and match must high price order', () => {
        // given
        const amount = new BigNumber(3);
        const price = new BigNumber('3.0');
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber(3),
        };
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(2),
        };
        const orders = [
            uiOrder({ side: OrderSide.Sell, price: new BigNumber('1.0'), size: new BigNumber(3), rawOrder: rawOrder1 }),
            uiOrder({ side: OrderSide.Sell, price: new BigNumber('2.0'), size: new BigNumber(4), rawOrder: rawOrder2 }),
        ];

        // when
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Buy);

        // then
        expect(marketFill.orders).toEqual([orders[0].rawOrder]);
        expect(marketFill.amounts).toEqual([new BigNumber(3)]);
    });

    it('Should not match any order on sell with high price', () => {
        // given
        const amount = new BigNumber(5);
        const price = new BigNumber('3');
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Sell);

        // then
        expect(marketFill.orders.length).toEqual(0);
    });
    it('Should not match any order on buy with lower price', () => {
        // given
        const amount = new BigNumber(5);
        const price = new BigNumber('0.5');
        const orders = [
            uiOrder({ side: OrderSide.Sell, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Sell, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Buy);

        // then
        expect(marketFill.orders.length).toEqual(0);
    });

    it('should round amounts up', () => {
        // given
        const rawOrder1 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(3),
            takerAssetAmount: new BigNumber('2,97029703'),
        };
        const uiOrder1 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('1.01'),
            size: new BigNumber(3),
            rawOrder: rawOrder1,
        });
        const rawOrder2 = {
            ...basicRawOrder,
            makerAssetAmount: new BigNumber(4),
            takerAssetAmount: new BigNumber(2),
        };
        const uiOrder2 = uiOrder({
            side: OrderSide.Buy,
            price: new BigNumber('2.0'),
            size: new BigNumber(4),
            rawOrder: rawOrder2,
        });
        const orders = [uiOrder1, uiOrder2];

        // when
        const amount = new BigNumber(5);
        const price = new BigNumber('3.0');
        const marketFill = utilOrders.buildMarketLimitMatchingOrders({ amount, orders, price }, OrderSide.Buy);

        // then
        expect(marketFill.orders).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(marketFill.amounts).toEqual([new BigNumber(4), new BigNumber(4)]);
    });
});
