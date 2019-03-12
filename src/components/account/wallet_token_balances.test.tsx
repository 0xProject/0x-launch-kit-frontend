import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import '../../icons';
import { TokenBalance, Web3State } from '../../util/types';

import { WalletTokenBalances } from './wallet_token_balances';

const noop = () => ({});
const ZERO = new BigNumber(0);
const wethTokenBalance = {
    balance: ZERO,
    token: {
        primaryColor: 'white',
        address: '0x100',
        decimals: 18,
        symbol: 'WETH',
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
                    symbol: 'MOCK1',
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
                    symbol: 'MOCK2',
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
                    symbol: 'MOCK3',
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
                onToggleTokenLock={noop}
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
                    symbol: 'MOCK1',
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
                    symbol: 'MOCK2',
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
                    symbol: 'MOCK3',
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
                onToggleTokenLock={noop}
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
                    symbol: 'MOCK1',
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
                    symbol: 'MOCK2',
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
                    symbol: 'MOCK3',
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
                onToggleTokenLock={onToggleTokenLock}
                web3State={Web3State.Done}
            />,
        );
        wrapper
            .find('tbody tr')
            .at(2)
            .find('[data-icon="lock"]')
            .simulate('click');

        // then
        expect(onToggleTokenLock).toHaveBeenCalledWith(tokenBalances[1]);
    });

    it('should call the onToggleTokenLock function when a unlocked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    primaryColor: 'white',
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1',
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
                    symbol: 'MOCK2',
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
                    symbol: 'MOCK3',
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
                onToggleTokenLock={onToggleTokenLock}
                web3State={Web3State.Done}
            />,
        );
        const rows = wrapper.find('tbody tr');
        rows.at(1)
            .find('[data-icon="lock-open"]')
            .simulate('click');

        // then
        expect(onToggleTokenLock).toHaveBeenCalledWith(tokenBalances[0]);
    });
});
