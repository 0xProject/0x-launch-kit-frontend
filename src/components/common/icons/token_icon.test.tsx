import React from 'react';
import renderer from 'react-test-renderer';

import { Token } from '../../../util/types';

import { TokenIcon } from './token_icon';

describe('TokenIcon', () => {
    it('TokenIcon ZRX to match snapshot', () => {
        // given
        const token: Token = {
            address: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            decimals: 18,
            name: '0x',
            symbol: 'zrx',
            primaryColor: '#232332',
        };

        const tokenIcon = <TokenIcon token={token} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('TokenIcon MLN to match snapshot', () => {
        // given
        const token: Token = {
            address: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            decimals: 18,
            name: '0x',
            symbol: 'mln',
            primaryColor: '#232332',
        };

        const tokenIcon = <TokenIcon token={token} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Without token', () => {
        // given
        const token: Token = {
            address: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
            decimals: 18,
            name: '0x',
            symbol: 'test',
            primaryColor: '#232332',
        };

        const tokenIcon = <TokenIcon token={token} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
