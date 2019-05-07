/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

import { Toolbar } from '../../../components/common/toolbar';
import { DefaultTheme } from '../../../themes/default_theme';

const theme = new DefaultTheme();

describe('Toolbar', () => {
    it('Toolbar to match snapshot', () => {
        // given
        const startContent = (
            <>
                <label>Start Content</label>
            </>
        );

        const endContent = (
            <>
                <label>End Content</label>
            </>
        );

        const toolbar = (
            <ThemeProvider theme={theme}>
                <Toolbar startContent={startContent} endContent={endContent} />
            </ThemeProvider>
        );

        // when
        const tree = renderer.create(toolbar).toJSON();

        // then
        expect(tree).toMatchSnapshot();
    });
});
