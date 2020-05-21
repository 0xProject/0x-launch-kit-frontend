import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardWrapper = styled.div`
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

export const CardBase: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <CardWrapper {...restProps}>{children}</CardWrapper>;
};
