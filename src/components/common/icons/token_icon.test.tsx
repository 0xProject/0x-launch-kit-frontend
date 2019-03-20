import React from 'react';
import renderer from 'react-test-renderer';

import { TokenIcon } from './token_icon';

describe('TokenIcon', () => {
    it('TokenIcon ZRX to match snapshot', () => {
        // given
        const symbol = 'zrx';
        const primaryColor = '#232332';

        const tokenIcon = <TokenIcon symbol={symbol} primaryColor={primaryColor} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('TokenIcon MLN to match snapshot', () => {
        // given
        const symbol = 'mln';
        const primaryColor = '#232332';

        const tokenIcon = <TokenIcon symbol={symbol} primaryColor={primaryColor} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Without token', () => {
        // given
        const symbol = 'test';
        const primaryColor = '#232332';

        const tokenIcon = <TokenIcon symbol={symbol} primaryColor={primaryColor} />;

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
