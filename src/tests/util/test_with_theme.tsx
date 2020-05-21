import { mount, shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';

import { DefaultTheme } from '../../themes/default_theme';

const theme = new DefaultTheme();

export const mountWithTheme = (children: React.ReactElement<any>) =>
    mount(<ThemeProvider theme={theme}>{children}</ThemeProvider>);

export const renderWithTheme = (children: any) =>
    renderer.create(<ThemeProvider theme={theme}>{children}</ThemeProvider>).toJSON();

export const shallowWithTheme = (children: any) => shallow(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
