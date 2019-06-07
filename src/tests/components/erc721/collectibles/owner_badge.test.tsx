/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

import { OwnerBadge } from '../../../../components/erc721/collectibles/owner_badge';
import { DefaultTheme } from '../../../../themes/default_theme';

const theme = new DefaultTheme();

describe('OwnerBadge', () => {
    it('OwnerBadge to match snapshot', () => {
        // given
        const ownerBadge = (
            <ThemeProvider theme={theme}>
                <OwnerBadge />
            </ThemeProvider>
        );

        // when
        const tree = renderer.create(ownerBadge).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
