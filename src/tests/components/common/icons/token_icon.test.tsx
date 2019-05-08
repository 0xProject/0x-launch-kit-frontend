import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

import { TokenIcon } from '../../../../components/common/icons/token_icon';
import { DefaultTheme } from '../../../../themes/default_theme';

const theme = new DefaultTheme();

describe('TokenIcon', () => {
    it('TokenIcon ZRX to match snapshot', () => {
        // given
        const symbol = 'zrx';
        const primaryColor = '#232332';

        const tokenIcon = (
            <ThemeProvider theme={theme}>
                <TokenIcon symbol={symbol} primaryColor={primaryColor} />
            </ThemeProvider>
        );

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('TokenIcon MLN to match snapshot', () => {
        // given
        const symbol = 'mln';
        const primaryColor = '#232332';

        const tokenIcon = (
            <ThemeProvider theme={theme}>
                <TokenIcon symbol={symbol} primaryColor={primaryColor} />
            </ThemeProvider>
        );

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });

    it('Without token', () => {
        // given
        const symbol = 'test';
        const primaryColor = '#232332';

        const tokenIcon = (
            <ThemeProvider theme={theme}>
                <TokenIcon symbol={symbol} primaryColor={primaryColor} />
            </ThemeProvider>
        );

        // when
        const tree = renderer.create(tokenIcon).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
