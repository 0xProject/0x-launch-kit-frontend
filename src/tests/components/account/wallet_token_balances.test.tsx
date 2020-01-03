/**
 * @jest-environment jsdom
 */

import { BigNumber } from '@0x/utils';
import React from 'react';

import { ZERO } from '../../../common/constants';
import { WalletTokenBalances } from '../../../components/account';
import { DefaultTheme } from '../../../themes/default_theme';
import { TokenBalance, TokenPrice, Web3State } from '../../../util/types';
import { mountWithTheme, renderWithTheme } from '../../util/test_with_theme';
const noop = () => ({});
const tokenDefaults = {
    displayDecimals: 2,
    primaryColor: 'white',
    decimals: 18,
};
const wethTokenBalance = {
    balance: ZERO,
    token: {
        ...tokenDefaults,
        address: '0x100',
        symbol: 'WETH',
        name: 'wETH',
    },
    isUnlocked: true,
};

const theme = new DefaultTheme();

describe('WalletTokenBalances', () => {
    it('should show one row for each token plus one for the total eth', () => {
        const account = '0x1';
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x1',
                    symbol: 'MOCK1',
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x2',
                    symbol: 'MOCK2',
                    name: 'MOCK2',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x3',
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const tokenPrices: TokenPrice[] = [
            {
                c_id: 'MOCK1',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
        ];

        const ethUSDPrice = new BigNumber(1);
        const onSubmitTransferToken = jest.fn();
        // when
        const wrapper = mountWithTheme(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={noop}
                onSubmitTransferToken={onSubmitTransferToken}
                web3State={Web3State.Done}
                ethAccount={account}
                ethUsd={ethUSDPrice}
                theme={theme}
                tokensPrice={tokenPrices}
            />,
        );

        // then
        expect(wrapper.find('tbody tr')).toHaveLength(5);
    });

    it('should properly show locked and unlocked tokens', () => {
        const account = '0x1';
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x1',
                    symbol: 'MOCK1',
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x2',
                    symbol: 'MOCK2',
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x3',
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const tokenPrices: TokenPrice[] = [
            {
                c_id: 'MOCK1',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
        ];

        const ethUSDPrice = new BigNumber(1);

        const onSubmitTransferToken = jest.fn();

        const tree = renderWithTheme(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={noop}
                onSubmitTransferToken={onSubmitTransferToken}
                web3State={Web3State.Done}
                ethAccount={account}
                ethUsd={ethUSDPrice}
                theme={theme}
                tokensPrice={tokenPrices}
            />,
        );

        // when
        expect(tree).toMatchSnapshot();
    });

    it('should call the onToggleTokenLock function when a locked token is clicked', () => {
        const account = '0x1';

        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x1',
                    symbol: 'MOCK1',
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x2',
                    symbol: 'MOCK2',
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x3',
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const tokenPrices: TokenPrice[] = [
            {
                c_id: 'MOCK1',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
        ];

        const ethUSDPrice = new BigNumber(1);
        const onToggleTokenLock = jest.fn();
        const onSubmitTransferToken = jest.fn();
        // when
        const wrapper = mountWithTheme(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={onToggleTokenLock}
                onSubmitTransferToken={onSubmitTransferToken}
                web3State={Web3State.Done}
                ethAccount={account}
                ethUsd={ethUSDPrice}
                theme={theme}
                tokensPrice={tokenPrices}
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
        const account = '0x1';
        const tokenBalances: TokenBalance[] = [
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x1',
                    symbol: 'MOCK1',
                    name: 'MOCK1',
                },
                isUnlocked: true,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x2',
                    symbol: 'MOCK2',
                    name: 'MOCK2',
                },
                isUnlocked: false,
            },
            {
                balance: new BigNumber(1),
                token: {
                    ...tokenDefaults,
                    address: '0x3',
                    symbol: 'MOCK3',
                    name: 'MOCK3',
                },
                isUnlocked: true,
            },
        ];
        const onToggleTokenLock = jest.fn();
        const onSubmitTransferToken = jest.fn();
        const tokenPrices: TokenPrice[] = [
            {
                c_id: 'MOCK1',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
            {
                c_id: 'MOCK2',
                price_usd: new BigNumber(1),
                price_usd_24h_change: new BigNumber(1),
            },
        ];

        const ethUSDPrice = new BigNumber(1);
        // when
        const wrapper = mountWithTheme(
            <WalletTokenBalances
                ethBalance={ZERO}
                wethTokenBalance={wethTokenBalance}
                tokenBalances={tokenBalances}
                onStartToggleTokenLockSteps={onToggleTokenLock}
                onSubmitTransferToken={onSubmitTransferToken}
                web3State={Web3State.Done}
                ethAccount={account}
                ethUsd={ethUSDPrice}
                theme={theme}
                tokensPrice={tokenPrices}
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
