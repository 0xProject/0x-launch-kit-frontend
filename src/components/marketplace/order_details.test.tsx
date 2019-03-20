/**
 * @jest-environment jsdom
 */

import { BigNumber, OrderStatus } from '0x.js';
import { HTMLAttributes, mount, ReactWrapper } from 'enzyme';
import React from 'react';

import * as CONSTANTS from '../../common/constants';
import * as storeFns from '../../store/selectors';
import * as dollarUtils from '../../util/market_prices';
import { tokenFactory } from '../../util/test-utils';
import { OrderSide, OrderType, UIOrder } from '../../util/types';

import { OrderDetails } from './order_details';

// Helper that returns the weth and usd texts from the corresponding element
const getValuesFromTotalCostText = (el: ReactWrapper<HTMLAttributes, any>) => {
    return el
        .text()
        .slice(1)
        .replace('wETH) $', '')
        .split(' ');
};

describe('OrderDetails', () => {
    it('Calculates total cost for limit orders', done => {
        // given
        const orderType = OrderType.Limit;
        const token = tokenFactory.build({ decimals: 18 });
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;

        // makerAmount = 50
        const makerAmount = new BigNumber(50000000000000000000);
        const tokenPrice = new BigNumber(10);
        const resultExpected = new BigNumber(501);
        // MAKER_FEE = 20
        // @ts-ignore
        CONSTANTS.MAKER_FEE = new BigNumber('1000000000000000000');
        // @ts-ignore
        dollarUtils.getZeroXPriceInWeth = jest.fn(() => {
            return new BigNumber(ZEROX_WETH_PRICE);
        });
        // @ts-ignore
        dollarUtils.getZeroXPriceInUSD = jest.fn(() => {
            return new BigNumber(ZEROX_USD_PRICE);
        });

        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        const openSellOrders: UIOrder[] = [];
        const openBuyOrders: UIOrder[] = [];

        // when
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                baseToken={token}
                operationType={OrderSide.Sell}
                openBuyOrders={openBuyOrders}
                openSellOrders={openSellOrders}
            />,
        );

        // then
        // Wait until component is fully updated to check if the values are generated
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(11);
            const resultsArray = getValuesFromTotalCostText(mySizeRowValue);

            const totalCostInWeth = resultsArray[0];
            const totalCostInUSD = resultsArray[1];
            expect(totalCostInWeth).toEqual(resultExpected.toFixed(2));
            expect(totalCostInUSD).toEqual(resultExpected.toFixed(2));
            wrapper.unmount();
            done();
        }, 0);
    });

    it('Calculates fees for market orders', done => {
        // given
        const orderType = OrderType.Market;
        const token = tokenFactory.build({ decimals: 18 });
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;
        // makerAmount = 10
        const makerAmount = new BigNumber(10000000000000000000);
        const tokenPrice = new BigNumber(10);
        const resultExpected = new BigNumber(2);
        // TAKER_FEE = 20
        const TAKER_FEE = new BigNumber(1000000000000000000);
        const MAKER_FEE = new BigNumber(1000000000000000000);

        const signedOrder1 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
        };

        const signedOrder2 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: new BigNumber(10000000000000000000), // size = 10
            filled: new BigNumber(0),
            price: new BigNumber(2),
            status: OrderStatus.Fillable,
        };

        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: new BigNumber(5000000000000000000), // size = 5
            filled: new BigNumber(0),
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };

        const openSellOrders = [sellOrder1, sellOrder2];
        const openBuyOrders: UIOrder[] = [];

        // @ts-ignore
        dollarUtils.getZeroXPriceInWeth = jest.fn(() => {
            return new BigNumber(ZEROX_WETH_PRICE);
        });
        // @ts-ignore
        dollarUtils.getZeroXPriceInUSD = jest.fn(() => {
            return new BigNumber(ZEROX_USD_PRICE);
        });

        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        // when
        // @ts-ignore
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                baseToken={token}
                operationType={OrderSide.Buy}
                openBuyOrders={openBuyOrders}
                openSellOrders={openSellOrders}
            />,
        );

        // then
        // Wait until component is fully updated to check if the values are generated
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(8);
            const resultsArray = mySizeRowValue
                .text()
                .replace(' ZRX', '')
                .split(' ');

            const feeInZrx = resultsArray[0];
            expect(feeInZrx).toEqual(resultExpected.toFixed(2));
            wrapper.unmount();
            done();
        }, 0);
    });

    it('Calculates total cost for market orders', done => {
        // given
        const orderType = OrderType.Market;
        const token = tokenFactory.build({ decimals: 18 });
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;
        // makerAmount = 10
        const makerAmount = new BigNumber(10000000000000000000);
        const tokenPrice = new BigNumber(10);
        const resultExpected = new BigNumber(17);
        // TAKER_FEE = 20
        const MAKER_FEE = new BigNumber(1000000000000000000);
        const TAKER_FEE = new BigNumber(1000000000000000000);

        const signedOrder1 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
        };

        const signedOrder2 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: TAKER_FEE,
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: new BigNumber(10000000000000000000), // size = 10
            filled: new BigNumber(0),
            price: new BigNumber(2),
            status: OrderStatus.Fillable,
        };

        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: new BigNumber(5000000000000000000), // size = 5
            filled: new BigNumber(0),
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };

        const openSellOrders = [sellOrder1, sellOrder2];
        const openBuyOrders: UIOrder[] = [];

        // @ts-ignore
        dollarUtils.getZeroXPriceInWeth = jest.fn(() => {
            return new BigNumber(ZEROX_WETH_PRICE);
        });
        // @ts-ignore
        dollarUtils.getZeroXPriceInUSD = jest.fn(() => {
            return new BigNumber(ZEROX_USD_PRICE);
        });

        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        // @ts-ignore
        storeFns.getOrders = jest.fn(() => {
            return [sellOrder1, sellOrder2];
        });

        // when
        // @ts-ignore
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                baseToken={token}
                operationType={OrderSide.Buy}
                openBuyOrders={openBuyOrders}
                openSellOrders={openSellOrders}
            />,
        );

        // then
        // Wait until component is fully updated to check if the values are generated
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(11);
            const resultsArray = getValuesFromTotalCostText(mySizeRowValue);
            const totalCostInWeth = resultsArray[0];
            const totalCostInUSD = resultsArray[1];
            expect(totalCostInWeth).toEqual(resultExpected.toFixed(2));
            expect(totalCostInUSD).toEqual(resultExpected.toFixed(2));
            wrapper.unmount();
            done();
        }, 0);
    });

    it('Do not displays a value if the order amount is not fillable on market', done => {
        // given
        const orderType = OrderType.Market;
        const token = tokenFactory.build({ decimals: 18 });
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;
        const makerAmount = new BigNumber(50);
        const tokenPrice = new BigNumber(10);
        const resultExpected = '---';
        const MAKER_FEE = new BigNumber(20);

        const signedOrder1 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: new BigNumber(1),
        };

        const signedOrder2 = {
            exchangeAddress: '0x48bacb9266a570d521063ef5dd96e61686dbe788',
            expirationTimeSeconds: new BigNumber(1),
            feeRecipientAddress: '0x0000000000000000000000000000000000000000',
            makerAddress: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            makerAssetAmount: new BigNumber(1),
            makerAssetData: '0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            makerFee: MAKER_FEE,
            salt: new BigNumber(1),
            senderAddress: '0x0000000000000000000000000000000000000000',
            signature:
                '0x1b8df6f877eb74f6d7efee28f09fd8904dc2c3cb9bf5d4410e3f0a9b3e43f3b1c658242774898f6b11c325434fb83b4f09288d3fe286be133db442f7fe0258342602',
            takerAddress: '0x0000000000000000000000000000000000000000',
            takerAssetAmount: new BigNumber(1),
            takerAssetData: '0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082',
            takerFee: new BigNumber(1),
        };

        const sellOrder1 = {
            rawOrder: signedOrder1,
            side: OrderSide.Sell,
            size: new BigNumber(10),
            filled: new BigNumber(0),
            price: new BigNumber(2),
            status: OrderStatus.Fillable,
        };

        const sellOrder2 = {
            rawOrder: signedOrder2,
            side: OrderSide.Sell,
            size: new BigNumber(5),
            filled: new BigNumber(0),
            price: new BigNumber(1),
            status: OrderStatus.Fillable,
        };

        const openSellOrders = [sellOrder1, sellOrder2];
        const openBuyOrders: UIOrder[] = [];

        // @ts-ignore
        dollarUtils.getZeroXPriceInWeth = jest.fn(() => {
            return new BigNumber(ZEROX_WETH_PRICE);
        });
        // @ts-ignore
        dollarUtils.getZeroXPriceInUSD = jest.fn(() => {
            return new BigNumber(ZEROX_USD_PRICE);
        });

        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new BigNumber(DOLAR_PRICE);
        });

        // @ts-ignore
        storeFns.getOrders = jest.fn(() => {
            return [sellOrder1, sellOrder2];
        });

        // when
        // @ts-ignore
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                baseToken={token}
                operationType={OrderSide.Sell}
                openBuyOrders={openBuyOrders}
                openSellOrders={openSellOrders}
            />,
        );

        // then
        // Wait until component is fully updated to check if the values are generated
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(11);
            // then
            expect(mySizeRowValue.text()).toEqual(resultExpected);
            wrapper.unmount();
            done();
        }, 0);
    });
});
