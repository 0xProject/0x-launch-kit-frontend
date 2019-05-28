import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';
import { ButtonVariant } from '../../util/types';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled?: boolean;
    variant?: ButtonVariant;
}

const StyledButton = styled.button<{ variant?: ButtonVariant }>`
    ${props =>
        props.variant && props.variant === ButtonVariant.Primary
            ? `background-color: ${props.theme.componentsTheme.buttonPrimaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Secondary
            ? `background-color: ${props.theme.componentsTheme.buttonSecondaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Tertiary
            ? `background-color: ${props.theme.componentsTheme.buttonTertiaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Quaternary
            ? `background-color: ${props.theme.componentsTheme.buttonQuaternaryBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Error
            ? `background-color: ${props.theme.componentsTheme.buttonErrorBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Balance
            ? `background-color: ${props.theme.componentsTheme.ethBoxActiveColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Sell
            ? `background-color: ${props.theme.componentsTheme.buttonSellBackgroundColor};`
            : ''}
    ${props =>
        props.variant && props.variant === ButtonVariant.Buy
            ? `background-color: ${props.theme.componentsTheme.buttonBuyBackgroundColor};`
            : ''}

    border-radius: ${themeDimensions.borderRadius};
    border: none;
    color: ${props => props.theme.componentsTheme.buttonTextColor};
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
