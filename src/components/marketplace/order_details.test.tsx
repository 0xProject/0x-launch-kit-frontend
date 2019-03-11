import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import * as CONSTANTS from '../../common/constants';
import * as dollarUtils from '../../util/market_prices';

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
            return new Promise(resolve => {
                resolve(new BigNumber(ZEROX_WETH_PRICE));
            });
        });
        // @ts-ignore
        dollarUtils.getZeroXPriceInUSD = jest.fn(() => {
            return new Promise(resolve => {
                resolve(new BigNumber(ZEROX_USD_PRICE));
            });
        });

        // @ts-ignore
        dollarUtils.getEthereumPriceInUSD = jest.fn(() => {
            return new Promise(resolve => {
                resolve(new BigNumber(DOLAR_PRICE));
            });
        });

        // when
        const wrapper = mount(
            <OrderDetails
                orderType={orderType}
                tokenAmount={makerAmount}
                tokenPrice={tokenPrice}
                selectedToken={token}
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
});
