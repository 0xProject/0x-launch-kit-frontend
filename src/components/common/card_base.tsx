import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const CardWrapper = styled.div`
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: ${props => props.theme.dimensions.borderRadius};
    border: ${props => props.theme.dimensions.borderWidth} solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

export const CardBase: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <CardWrapper {...restProps}>{children}</CardWrapper>;
};
