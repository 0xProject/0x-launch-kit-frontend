import { BigNumber } from '0x.js';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { TokenBalance } from '../../util/types';

import { WalletTokenBalances } from './wallet_token_balances';

configure({ adapter: new Adapter() });

describe('WalletTokenBalances', () => {
    it('should show one row for each token', () => {
        const knownTokens: TokenBalance[] = [{
            balance: new BigNumber(1),
            token: {
                address: '0x1',
                decimals: 18,
                symbol: 'MOCK1',
            },
        }, {
            balance: new BigNumber(1),
            token: {
                address: '0x2',
                decimals: 18,
                symbol: 'MOCK2',
            },
        }, {
            balance: new BigNumber(1),
            token: {
                address: '0x3',
                decimals: 18,
                symbol: 'MOCK3',
            },
        }];

        // when
        const wrapper = mount(<WalletTokenBalances knownTokens={knownTokens} />);

        // then
        expect(wrapper.find('tbody tr')).toHaveLength(3);
    });
});
