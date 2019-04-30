import { mount } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { DefaultTheme } from '../../themes/default_theme';

export const mountWithTheme = (children: React.ReactElement<any>) => {
    const theme = new DefaultTheme();
    return mount(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};
