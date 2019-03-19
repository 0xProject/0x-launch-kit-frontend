/**
 * @jest-environment jsdom
 */

import { mount } from 'enzyme';
import React from 'react';

import { Web3State } from '../../util/types';

import { WalletBalance } from './wallet_balance';

describe('WalletBalance', () => {
    it('should display a message if the user did not accepted metamask permissions', async () => {
        // given
        const resultExpected1 = 'Click to Connect MetaMask';
        const onConnectWalletFn = jest.fn();
        // when
        const wrapper = mount(<WalletBalance web3State={Web3State.Locked} onConnectWallet={onConnectWalletFn} />);

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
    });
    it('should display a message if the user did not have metamask installed', async () => {
        // given
        const resultExpected1 = 'No wallet found';
        const resultExpected2 = 'Get Chrome Extension';
        const onConnectWalletFn = jest.fn();
        // when
        const wrapper = mount(<WalletBalance web3State={Web3State.NotInstalled} onConnectWallet={onConnectWalletFn} />);

        // then
        const result = wrapper.text();
        expect(result).toContain(resultExpected1);
        expect(result).toContain(resultExpected2);
    });
});
