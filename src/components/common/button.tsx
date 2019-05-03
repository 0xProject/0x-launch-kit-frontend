import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled?: boolean;
    variant?: string;
}

const StyledButton = styled.button<{ variant?: string }>`

    ${props =>
        props.variant && props.variant === 'primary'
            ? `background-color: ${props.theme.componentsTheme.buttonPrimaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === 'secondary'
            ? `background-color: ${props.theme.componentsTheme.buttonSecondaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === 'tertiary'
            ? `background-color: ${props.theme.componentsTheme.buttonTertiaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === 'error'
            ? `background-color: ${props.theme.componentsTheme.buttonErrorBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === 'balance'
            ? `background-color: ${props.theme.componentsTheme.ethBoxActiveColor};`
            : ''}

    border-radius: ${themeDimensions.borderRadius};
    border: none;
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    padding: 15px;
    user-select: none;

    &:focus {
        outline: none;
    }

    &:disabled {
        cursor: default;
        opacity: 0.5;
    }
`;

export const Button: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <StyledButton {...restProps}>{children}</StyledButton>;
};
