import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors } from '../../themes/commons';

interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled?: boolean;
    theme?: string;
}

interface ButtonColors {
    [primary: string]: string;
    secondary: string;
    tertiary: string;
    error: string;
}

const buttonColors: ButtonColors = {
    error: themeColors.errorButtonBackground,
    primary: themeColors.darkBlue,
    secondary: themeColors.darkGray,
    tertiary: themeColors.orange,
};

const StyledButton = styled.button`
    background-color: ${props => (props.theme.length ? buttonColors[props.theme] : buttonColors.primary)};
    border-radius: 4px;
    border: 0;
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
