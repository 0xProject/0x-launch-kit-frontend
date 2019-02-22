import { BigNumber } from '0x.js';
import { mount } from 'enzyme';
import React from 'react';

import '../../icons';
import { TokenBalance, Web3State } from '../../util/types';

import { WalletTokenBalances } from './wallet_token_balances';

const noop = () => ({});

describe('WalletTokenBalances', () => {
    it('should show one row for each token', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
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
            <WalletTokenBalances tokenBalances={tokenBalances} onUnlockToken={noop} web3State={Web3State.Done} />,
        );

        // then
        expect(wrapper.find('tbody tr')).toHaveLength(3);
    });

    it('should properly show locked and unlocked tokens', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
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
            <WalletTokenBalances tokenBalances={tokenBalances} onUnlockToken={noop} web3State={Web3State.Done} />,
        );

        // then
        const rows = wrapper.find('tbody tr');
        expect(rows.at(0).find('[data-icon="lock-open"]')).toExist();
        expect(rows.at(1).find('[data-icon="lock"]')).toExist();
        expect(rows.at(2).find('[data-icon="lock-open"]')).toExist();
    });

    it('should call the onUnlockToken function when a locked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
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
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onUnlockToken = jest.fn();
        const onLockToken = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                tokenBalances={tokenBalances}
                onUnlockToken={onUnlockToken}
                onLockToken={onLockToken}
            />,
        );
        wrapper
            .find('tbody tr')
            .at(1)
            .find('[data-icon="lock"]')
            .simulate('click');

        // then
        expect(onUnlockToken).toHaveBeenCalledWith(tokenBalances[1].token);
    });

    it('should not call the onUnlockToken function when a unlocked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
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
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onUnlockToken = jest.fn();
        const onLockToken = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                tokenBalances={tokenBalances}
                onUnlockToken={onUnlockToken}
                onLockToken={onLockToken}
            />,
        );
        wrapper
            .find('tbody tr')
            .at(0)
            .find('[data-icon="lock-open"]')
            .simulate('click');

        // then
        expect(onUnlockToken).not.toHaveBeenCalled();
    });
    it('should call the lock function when a unlocked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onUnlockToken = jest.fn();
        const onLockToken = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                tokenBalances={tokenBalances}
                onUnlockToken={onUnlockToken}
                onLockToken={onLockToken}
            />,
        );
        const rows = wrapper.find('tbody tr');
        rows.at(0)
            .find('[data-icon="lock-open"]')
            .simulate('click');

        // then
        expect(onLockToken).toHaveBeenCalled();
    });
    it('should not call the lock function when a locked token is clicked', () => {
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x1',
                    decimals: 18,
                    symbol: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x2',
                    decimals: 18,
                    symbol: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    address: '0x3',
                    decimals: 18,
                    symbol: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onUnlockToken = jest.fn();
        const onLockToken = jest.fn();

        // when
        const wrapper = mount(
            <WalletTokenBalances
                tokenBalances={tokenBalances}
                onUnlockToken={onUnlockToken}
                onLockToken={onLockToken}
            />,
        );
        const rows = wrapper.find('tbody tr');
        rows.at(1)
            .find('[data-icon="lock"]')
            .simulate('click');

        // then
        expect(onLockToken).not.toHaveBeenCalled();
    });
});
