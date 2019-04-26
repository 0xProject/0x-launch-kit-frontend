import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors, themeDimensions } from '../../themes/ThemeCommons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardWrapper = styled.div`
    background-color: #fff;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${themeColors.borderColor};
`;

export const CardBase: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <CardWrapper {...restProps}>{children}</CardWrapper>;
};
