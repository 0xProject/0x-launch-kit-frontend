/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import { mount, shallow } from 'enzyme';
import React from 'react';

import * as tokenServices from '../../services/tokens';
import { addressFactory, tokenFactory } from '../../util/test-utils';
import { TokenSymbol, Web3State } from '../../util/types';

import { WalletBalance } from './wallet_balance';

describe('WalletBalance', () => {
    let originalGetTokenBalance: any;
    beforeEach(() => {
        originalGetTokenBalance = tokenServices.getTokenBalance;

        // @ts-ignore
        tokenServices.getTokenBalance = jest.fn(
            (): Promise<BigNumber> => {
                return new Promise((resolve: (bn: BigNumber) => any) => {
                    resolve(new BigNumber('2.0'));
                });
            },
        );
    });
    afterEach(() => {
        // @ts-ignore
        tokenServices.getTokenBalance = originalGetTokenBalance;
    });
    it('should display a message if the user did not accepted metamask permissions', async () => {
        // given
        const resultExpected1 = 'Click to Connect MetaMask';
        const ethAccount = addressFactory.build().address;
        const onConnectWalletFn = jest.fn();
        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = {
            base: baseToken.symbol,
            quote: quoteToken.symbol,
        };

        // when
        const wrapper = mount(
            <WalletBalance
                web3State={Web3State.Locked}
                onConnectWallet={onConnectWalletFn}
                baseToken={baseToken}
                quoteToken={quoteToken}
                currencyPair={currencyPair}
                ethAccount={ethAccount}
            />,
        );

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
    });
    it('should display a message if the user did not have metamask installed', async () => {
        // given
        const resultExpected1 = 'No wallet found';
        const resultExpected2 = 'Get Chrome Extension';
        const ethAccount = addressFactory.build().address;
        const onConnectWalletFn = jest.fn();
        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = {
            base: baseToken.symbol,
            quote: quoteToken.symbol,
        };
        // when
        const wrapper = mount(
            <WalletBalance
                web3State={Web3State.NotInstalled}
                onConnectWallet={onConnectWalletFn}
                baseToken={baseToken}
                quoteToken={quoteToken}
                currencyPair={currencyPair}
                ethAccount={ethAccount}
            />,
        );

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
        expect(result).toContain(resultExpected2);
    });
    it('should display quote and base balances', async done => {
        // given
        const baseToken = tokenFactory.build();
        const quoteToken = tokenFactory.build();
        const currencyPair = {
            base: TokenSymbol.Weth,
            quote: TokenSymbol.Zrx,
        };
        const ethAccount = 'This is a test';

        const resultExpected1 = 'wETH';
        const resultExpected2 = 'ZRX';
        const amountExpected = '2.0';
        const onConnectWalletFn = jest.fn();
        // when
        const wrapper = shallow(
            <WalletBalance
                web3State={Web3State.Done}
                onConnectWallet={onConnectWalletFn}
                baseToken={baseToken}
                currencyPair={currencyPair}
                ethAccount={ethAccount}
                quoteToken={quoteToken}
            />,
        );

        // then
        setTimeout(() => {
            // Base name ex: 'zrx'
            const baseTokenResult = wrapper
                .childAt(1)
                .childAt(0)
                .text();
            // Base value ex: 2.0
            const baseValueResult = wrapper
                .childAt(1)
                .childAt(1)
                .text();
            // Quote name ex: 'zrx'
            const quoteTokenResult = wrapper
                .childAt(2)
                .childAt(0)
                .text();
            // Quote value ex: 2.0
            const quoteValueResult = wrapper
                .childAt(2)
                .childAt(1)
                .text();
            expect(baseTokenResult).toContain(resultExpected1);
            expect(quoteTokenResult).toContain(resultExpected2);
            expect(quoteValueResult).toContain(amountExpected);
            expect(baseValueResult).toContain(amountExpected);
            expect(tokenServices.getTokenBalance).toHaveBeenCalledTimes(2);
            done();
        }, 0);
    });
});
