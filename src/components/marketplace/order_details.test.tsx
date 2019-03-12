import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import * as CONSTANTS from '../../common/constants';
import * as orderUtils from '../../services/orders';
import { store } from '../../store';
import * as dollarUtils from '../../util/market_prices';
import { OrderSide } from '../../util/types';

import { OrderDetails } from './order_details';

enum OrderType {
    Limit,
    Market,
}

describe('OrderDetails', () => {
    it('Calculates total cost for limit orders', done => {
        // given
        const orderType = OrderType.Limit;
        const token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
            primaryColor: '',
        };
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;
        const makerAmount = new BigNumber(50);
        const tokenPrice = new BigNumber(10);
        const resultExpected = new BigNumber(501);
        // @ts-ignore
        CONSTANTS.MAKER_FEE = '1.0';
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
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                selectedToken={token}
                operationType={OrderSide.Buy}
                state={null}
            />,
        );

        // then
        /* Wait until component is fully updated to check if the values are generated */
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(10);
            // then
            const resultsArray = mySizeRowValue
                .text()
                .replace('Total Cost(', '')
                .split(' ');

            const totalCostInWeth = resultsArray[0];
            const totalCostInUSD = resultsArray[3];
            expect(totalCostInWeth).toEqual(resultExpected.toFixed(2));
            expect(totalCostInUSD).toEqual(resultExpected.toFixed(2));
            wrapper.unmount();
            done();
        }, 0);
    });
    it('Calculates fees for market orders', done => {
        // given
        const orderType = OrderType.Market;
        const token = {
            address: '0x871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c',
            decimals: 0,
            name: '0x',
            symbol: 'zrx',
            primaryColor: '',
        };
        const DOLAR_PRICE = 1;
        const ZEROX_WETH_PRICE = 1;
        const ZEROX_USD_PRICE = 1;
        const makerAmount = new BigNumber(50);
        const tokenPrice = new BigNumber(10);
        const resultExpected = new BigNumber(40);
        const MAKER_FEE = new BigNumber(20);
        const storeState = store.getState();

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
        orderUtils.getAllOrdersToFillMarketOrder = jest.fn(() => {
            return [signedOrder1, signedOrder2];
        });

        // when
        // @ts-ignore
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                selectedToken={token}
                operationType={OrderSide.Buy}
                state={storeState}
            />,
        );

        // then
        /* Wait until component is fully updated to check if the values are generated */
        setTimeout(() => {
            const mySizeRowValue = wrapper.find('StyledComponent').at(9);
            // then
            const resultsArray = mySizeRowValue
                .text()
                .replace(' ZRX', '')
                .split(' ');

            const feeInZrx = resultsArray[0];
            expect(feeInZrx).toEqual(resultExpected.toString());
            wrapper.unmount();
            done();
        }, 0);
    });
});
