import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { BasicTheme } from '../../themes/BasicTheme';
import { StyledComponentThemeProps } from '../../util/types';

interface ButtonColors {
    [primary: string]: string;
    secondary: string;
    tertiary: string;
    error: string;
}

interface Props extends HTMLAttributes<HTMLButtonElement>, StyledComponentThemeProps {
    children: React.ReactNode;
    disabled?: boolean;
    theme?: string;
}

const getButtonColors = (themeColors: BasicTheme): ButtonColors => {
    return {
        error: themeColors.errorButtonBackground,
        primary: themeColors.darkBlue,
        secondary: themeColors.darkGray,
        tertiary: themeColors.orange,
    };
};

interface ButtonColors {
    error: string;
    primary: string;
    secondary: string;
    tertiary: string;
}

interface StyledButtonProps {
    buttonColors: ButtonColors;
}

const StyledButton = styled.button<StyledButtonProps>`
    background-color: ${props => (props.theme ? props.buttonColors[props.theme] : props.buttonColors.primary)};
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
    const { children, themeColors, ...restProps } = props;
    const buttonColors = getButtonColors(themeColors);

    return (
        <StyledButton buttonColors={buttonColors} {...restProps}>
            {children}
        </StyledButton>
    );
};
