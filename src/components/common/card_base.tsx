import React from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/ThemeCommons';
import { StyledComponentThemeProps } from '../../util/types';

interface Props extends StyledComponentThemeProps {
    children: React.ReactNode;
}

const CardWrapper = styled.div<StyledComponentThemeProps>`
    background-color: #fff;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.themeColors.borderColor};
`;

export const CardBase: React.FC<Props> = props => {
    const { children, themeColors, ...restProps } = props;

    return (
        <CardWrapper themeColors={themeColors} {...restProps}>
            {children}
        </CardWrapper>
    );
};
