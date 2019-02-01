import { assetDataUtils, BigNumber, OrderInfo, OrderStatus } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { Token, UIOrderSide } from './types';
import { ordersToUIOrders } from './ui_orders';

describe('ordersToUIOrders', () => {
    it('should convert a sell Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [makeSellOrder({
            makerAssetAmount: '1',
            takerAssetAmount: '50',
        })];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [{
            orderHash: '',
            orderStatus: OrderStatus.Fillable,
            orderTakerAssetFilledAmount: new BigNumber('0'),
        }];

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
        });
    });

    it('should convert a buy Order to a UIOrder', async () => {
        // given
        const orders: SignedOrder[] = [makeBuyOrder({
            makerAssetAmount: '100',
            takerAssetAmount: '1',
        })];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [{
            orderHash: '',
            orderStatus: OrderStatus.Fillable,
            orderTakerAssetFilledAmount: new BigNumber('0'),
        }];

        // when
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(uiOrders).toHaveLength(1);
        expect(uiOrders[0]).toEqual({
            rawOrder: orders[0],
            side: UIOrderSide.Buy,
            size: new BigNumber('100'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
        });
    });

    it('should convert buy and sell Orders to UIOrders', async () => {
        // given
        const orders: SignedOrder[] = [makeSellOrder({
            makerAssetAmount: '1',
            takerAssetAmount: '50',
        }), makeBuyOrder({
            makerAssetAmount: '100',
            takerAssetAmount: '1',
        })];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [{
            orderHash: '',
            orderStatus: OrderStatus.Fillable,
            orderTakerAssetFilledAmount: new BigNumber('0'),
        }, {
            orderHash: '',
            orderStatus: OrderStatus.Fillable,
            orderTakerAssetFilledAmount: new BigNumber('0'),
        }];

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
        });
        expect(uiOrders[1]).toEqual({
            rawOrder: orders[1],
            side: UIOrderSide.Buy,
            size: new BigNumber('100'),
            filled: new BigNumber('0'),
            price: new BigNumber('100'),
            status: OrderStatus.Fillable,
        });
    });

    it('should throw if orders length and ordersInfo length don\'t match', async () => {
        // given
        const orders: SignedOrder[] = [makeBuyOrder({
            makerAssetAmount: '1',
            takerAssetAmount: '100',
        }), makeSellOrder({
            makerAssetAmount: '100',
            takerAssetAmount: '1',
        })];
        const selectedToken = mockToken1;
        const ordersInfo: OrderInfo[] = [{
            orderHash: '',
            orderStatus: OrderStatus.Fillable,
            orderTakerAssetFilledAmount: new BigNumber('0'),
        }];

        // when
        const functionCall = () => ordersToUIOrders(orders, ordersInfo, selectedToken);

        // then
        expect(functionCall).toThrow();
    });
});

const mockToken1: Token = {
    address: '0xBA50C9066a29268904Bd074C1C6A17f3575a84e7',
    decimals: 18,
    symbol: 'MOCK1',
};

const mockToken2: Token = {
    address: '0x1F7B687533F4Afa4fAA41c2D2fBca05Cc0C3Fd65',
    decimals: 18,
    symbol: 'MOCK2',
};

const makeSellOrder = ({ makerAssetAmount, takerAssetAmount }: { makerAssetAmount: string; takerAssetAmount: string }) => {
    const oneYearFromNow = Math.floor(new Date().valueOf() / 1000) + 3600 * 24 * 365;

    return {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        takerAddress: '0x0000000000000000000000000000000000000000',
        senderAddress: '0x0000000000000000000000000000000000000000',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        expirationTimeSeconds: new BigNumber(oneYearFromNow),
        salt: new BigNumber('4253024946184612711043400606072358480456814389671017608724053124375087745'),
        makerAssetAmount: new BigNumber(makerAssetAmount),
        takerAssetAmount: new BigNumber(takerAssetAmount),
        makerAssetData: assetDataUtils.encodeERC20AssetData(mockToken1.address),
        takerAssetData: assetDataUtils.encodeERC20AssetData(mockToken2.address),
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber( '0' ),
        signature: '',
    };
};

const makeBuyOrder = ({ makerAssetAmount, takerAssetAmount }: { makerAssetAmount: string; takerAssetAmount: string }) => {
    const oneYearFromNow = Math.floor(new Date().valueOf() / 1000) + 3600 * 24 * 365;

    return {
        makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
        takerAddress: '0x0000000000000000000000000000000000000000',
        senderAddress: '0x0000000000000000000000000000000000000000',
        feeRecipientAddress: '0x0000000000000000000000000000000000000000',
        expirationTimeSeconds: new BigNumber(oneYearFromNow),
        salt: new BigNumber('4253024946184612711043400606072358480456814389671017608724053124375087745'),
        makerAssetAmount: new BigNumber(makerAssetAmount),
        takerAssetAmount: new BigNumber(takerAssetAmount),
        makerAssetData: assetDataUtils.encodeERC20AssetData(mockToken2.address),
        takerAssetData: assetDataUtils.encodeERC20AssetData(mockToken1.address),
        makerFee: new BigNumber('0'),
        takerFee: new BigNumber( '0' ),
        signature: '',
    };
};
