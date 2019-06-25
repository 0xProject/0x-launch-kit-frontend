import { assetDataUtils, BigNumber, Order } from '0x.js';

import { getKnownTokens } from '../../util/known_tokens';
import * as utilOrders from '../../util/orders';
import { addressFactory, uiOrder } from '../../util/test-utils';
import { OrderSide } from '../../util/types';

describe('buildLimitOrder', () => {
    const ZrxToken = getKnownTokens().getTokenBySymbol('zrx');
    const WethToken = getKnownTokens().getTokenBySymbol('weth');

    it('should build a buy order', async () => {
        // given
        const account = addressFactory.build().address;
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const baseTokenAddress = baseToken.address;
        const quoteTokenAddress = quoteToken.address;
        const exchangeAddress = addressFactory.build().address;
        const amount = new BigNumber('100');
        const price = new BigNumber(0.1);

        const spy = jest.spyOn(utilOrders, 'getOrderWithTakerAndFeeConfigFromRelayer');
        spy.mockReturnValue({
            account,
            makerAddress: account,
            baseTokenAddress,
            quoteTokenAddress,
            amount,
            price,
            exchangeAddress,
            makerAssetAmount: new BigNumber('10'),
            makerAssetData: assetDataUtils.encodeERC20AssetData(quoteTokenAddress),
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber('100'),
            takerAssetData: assetDataUtils.encodeERC20AssetData(baseTokenAddress),
        } as any);

        // when
        const order = await utilOrders.buildLimitOrder(
            {
                account,
                baseTokenAddress,
                quoteTokenAddress,
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
        expect(order.makerAssetData).toEqual(assetDataUtils.encodeERC20AssetData(quoteTokenAddress));
        expect(order.takerAddress).toEqual('0x0000000000000000000000000000000000000000');
        expect(order.takerAssetAmount).toEqual(new BigNumber('100'));
        expect(order.takerAssetData).toEqual(assetDataUtils.encodeERC20AssetData(baseTokenAddress));
    });

    it('should build a sell order', async () => {
        // given
        const account = addressFactory.build().address;
        const baseToken = ZrxToken;
        const quoteToken = WethToken;
        const baseTokenAddress = baseToken.address;
        const quoteTokenAddress = quoteToken.address;
        const exchangeAddress = addressFactory.build().address;
        const amount = new BigNumber('100');
        const price = new BigNumber(0.1);

        // when
        const spy = jest.spyOn(utilOrders, 'getOrderWithTakerAndFeeConfigFromRelayer');
        spy.mockReturnValue({
            account,
            makerAddress: account,
            baseTokenAddress,
            quoteTokenAddress,
            amount,
            price,
            exchangeAddress,
            makerAssetAmount: new BigNumber('100'),
            makerAssetData: assetDataUtils.encodeERC20AssetData(baseTokenAddress),
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber('10'),
            takerAssetData: assetDataUtils.encodeERC20AssetData(quoteTokenAddress),
        } as any);

        const order = await utilOrders.buildLimitOrder(
            {
                account,
                baseTokenAddress,
                quoteTokenAddress,
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
        expect(order.makerAssetData).toEqual(assetDataUtils.encodeERC20AssetData(baseTokenAddress));
        expect(order.takerAddress).toEqual('0x0000000000000000000000000000000000000000');
        expect(order.takerAssetAmount).toEqual(new BigNumber('10'));
        expect(order.takerAssetData).toEqual(assetDataUtils.encodeERC20AssetData(quoteTokenAddress));
    });
});

describe('buildMarketOrders', () => {
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
        const orders = [uiOrder1, uiOrder2];

        // when
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(2)]);
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
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
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
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([rawOrder2, rawOrder1]);
        expect(amounts).toEqual([new BigNumber(3), new BigNumber(4)]);
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
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(ordersToFill).toEqual([rawOrder2, rawOrder1]);
        expect(amounts).toEqual([new BigNumber(4), new BigNumber(1)]);
    });

    it('work when only one order is enough', () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(ordersToFill).toEqual([orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(5)]);
    });

    it('should indicate when the amount can be filled', () => {
        // given
        const amount = new BigNumber(5);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [, , canBeFilled] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(canBeFilled).toBe(true);
    });

    it('should indicate when the amount cannot be filled', () => {
        // given
        const amount = new BigNumber(10);
        const orders = [
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('1.0'), size: new BigNumber(3) }),
            uiOrder({ side: OrderSide.Buy, price: new BigNumber('2.0'), size: new BigNumber(6) }),
        ];

        // when
        const [, , canBeFilled] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Sell);

        // then
        expect(canBeFilled).toBe(false);
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
        const [ordersToFill, amounts] = utilOrders.buildMarketOrders({ amount, orders }, OrderSide.Buy);

        // then
        expect(ordersToFill).toEqual([orders[0].rawOrder, orders[1].rawOrder]);
        expect(amounts).toEqual([new BigNumber(4), new BigNumber(4)]);
    });
});

describe('sumTakerAssetFillableOrders', () => {
    const ZrxToken = getKnownTokens().getTokenBySymbol('zrx');
    const WethToken = getKnownTokens().getTokenBySymbol('weth');

    const account = addressFactory.build().address;
    const baseToken = ZrxToken;
    const quoteToken = WethToken;
    const baseTokenAddress = baseToken.address;
    const quoteTokenAddress = quoteToken.address;
    const exchangeAddress = addressFactory.build().address;
    // The check is the same on both scenarios, we will abstract it into a function here
    const getSumAndCheckExpectation = async (
        orderCreationSide: OrderSide,
        sumCheckSide: OrderSide,
        amountsToFill: number[],
        expectation: string,
    ) => {
        // given some orders create with orderCreationSide and the correspondign amounts
        const amountAndPrices = [
            { amount: new BigNumber(1), price: new BigNumber(0.25) },
            { amount: new BigNumber(2), price: new BigNumber(0.5) },
            { amount: new BigNumber(1), price: new BigNumber(0.3) },
        ];

        const orders: Order[] = await Promise.all(
            amountAndPrices.map(amountAndPrice => {
                const spy = jest.spyOn(utilOrders, 'getOrderWithTakerAndFeeConfigFromRelayer');
                spy.mockReturnValue({
                    account,
                    makerAddress: account,
                    baseTokenAddress,
                    quoteTokenAddress,
                    amount: amountAndPrice.amount,
                    price: amountAndPrice.price,
                    exchangeAddress,
                    makerAssetAmount: new BigNumber('100'),
                    makerAssetData: assetDataUtils.encodeERC20AssetData(baseTokenAddress),
                    takerAddress: '0x0000000000000000000000000000000000000000',
                    takerAssetAmount: new BigNumber('10'),
                    takerAssetData: assetDataUtils.encodeERC20AssetData(quoteTokenAddress),
                } as any);
                return utilOrders.buildLimitOrder(
                    {
                        account,
                        baseTokenAddress,
                        quoteTokenAddress,
                        amount: amountAndPrice.amount,
                        price: amountAndPrice.price,
                        exchangeAddress,
                    },
                    orderCreationSide,
                );
            }),
        );
        // when sum is calculated with the given/corresponding amounts to fill
        const sum = utilOrders.sumTakerAssetFillableOrders(
            sumCheckSide,
            orders,
            amountsToFill.map(n => new BigNumber(n)),
        );
        // then sum should be equal to the expectation
        expect(sum.toString()).toBe(expectation);
    };

    it('should sum the corresponding maker collectible amounts of fillable buy orders', async () => {
        const orderCreationSide = OrderSide.Buy;
        const sumCheckSide = OrderSide.Sell;
        // The sum of maker collectible is needs to take into consideration the correspondig prices
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 0, 0], '10');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 1, 0], '20');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 2, 0], '30');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 1, 1], '30');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 2, 1], '40');
    });

    it('should sum the corresponding maker collectible amounts of fillable sell orders', async () => {
        const orderCreationSide = OrderSide.Sell;
        const sumCheckSide = OrderSide.Buy;
        // The sum of maker collectible is the sum of the amounts specified by the given array
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 0, 0], '1');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 1, 0], '2');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 2, 0], '3');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 1, 1], '3');
        await getSumAndCheckExpectation(orderCreationSide, sumCheckSide, [1, 2, 1], '4');
    });
});
