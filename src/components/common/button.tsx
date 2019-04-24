import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { StoreState, StyledComponentThemeProps } from '../../util/types';

interface ButtonColors {
    [primary: string]: string;
    secondary: string;
    tertiary: string;
    error: string;
}

interface StateProps {
    themeColorsConfig: BasicTheme;
}

interface OwnProps extends HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    disabled?: boolean;
    theme?: string;
}

type Props = OwnProps & StateProps;

const getButtonColors = (themeColors: BasicTheme): ButtonColors => {
    return {
        error: themeColors.errorButtonBackground,
        primary: themeColors.darkBlue,
        secondary: themeColors.darkGray,
        tertiary: themeColors.orange,
    };
};

const StyledButton = styled.button<StyledComponentThemeProps>`
    background-color: ${props =>
        props.theme.length
            ? getButtonColors(props.themeColors)[props.theme]
            : getButtonColors(props.themeColors).primary};
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

const Button: React.FC<Props> = props => {
    const { children, themeColorsConfig, ...restProps } = props;

    return (
        <StyledButton themeColors={themeColorsConfig} {...restProps}>
            {children}
        </StyledButton>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const ButtonContainer = connect(mapStateToProps)(Button);

export { Button, ButtonContainer };
