/**
 * @jest-environment jsdom
 */

import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import { WalletTokenBalances } from '../../../components/account';
import { TokenBalance, TokenSymbol, Web3State } from '../../../util/types';

const noop = () => ({});
const ZERO = new BigNumber(0);
const wethTokenBalance = {
    balance: ZERO,
    token: {
        primaryColor: 'white',
        address: '0x100',
        decimals: 18,
        symbol: 'WETH' as TokenSymbol,
        name: 'wETH',
    },
    isUnlocked: true,
};

describe('WalletTokenBalances', () => {
    it('should show one row for each token plus one for the total eth', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1' as TokenSymbol,
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2' as TokenSymbol,
                    name: 'MOCK2',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3' as TokenSymbol,
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];

        // when
        const wrapper = mount(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={noop}
                web3State={Web3State.Done}
            />,
        );

        // then
        expect(wrapper.find('tbody tr')).toHaveLength(4);
    });

    it('should properly show locked and unlocked tokens', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1' as TokenSymbol,
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2' as TokenSymbol,
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3' as TokenSymbol,
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];

        // when
        const wrapper = mount(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={noop}
                web3State={Web3State.Done}
            />,
        );

        // then
        const rows = wrapper.find('tbody tr');

        // total eth
        expect(rows.at(0).find('[data-icon="lock-open"]')).toExist();

        // other tokens
        expect(rows.at(1).find('[data-icon="lock-open"]')).toExist();
        expect(rows.at(2).find('[data-icon="lock"]')).toExist();
        expect(rows.at(3).find('[data-icon="lock-open"]')).toExist();
    });

    it('should call the onToggleTokenLock function when a locked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1' as TokenSymbol,
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2' as TokenSymbol,
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3' as TokenSymbol,
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onToggleTokenLock = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={onToggleTokenLock}
                web3State={Web3State.Done}
            />,
        );
        wrapper
            .find('tbody tr')
            .at(2)
            .find('[data-icon="lock"]')
            .simulate('click');

        // then
        expect(onToggleTokenLock).toHaveBeenCalledWith(tokenBalances[1].token, tokenBalances[1].isUnlocked);
    });

    it('should call the onToggleTokenLock function when a unlocked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1' as TokenSymbol,
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2' as TokenSymbol,
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3' as TokenSymbol,
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onToggleTokenLock = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={onToggleTokenLock}
                web3State={Web3State.Done}
            />,
        );
        const rows = wrapper.find('tbody tr');
        rows.at(1)
            .find('[data-icon="lock-open"]')
            .simulate('click');

        // then
        expect(onToggleTokenLock).toHaveBeenCalledWith(tokenBalances[0].token, tokenBalances[0].isUnlocked);
    });
});
