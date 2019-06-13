import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    onClick?: any;
    text: string;
}

export const DropdownTextItemWrapper = styled.div<{ active?: boolean }>`
    background-color: ${props =>
        props.active ? props.theme.componentsTheme.rowActive : props.theme.componentsTheme.dropdownBackgroundColor};
    border-bottom: 1px solid ${props => props.theme.componentsTheme.dropdownBorderColor};
    color: ${props => props.theme.componentsTheme.dropdownTextColor};
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.3;
    padding: 12px ${props => props.theme.dimensions.horizontalPadding};

    &:hover {
        background-color: ${props => props.theme.componentsTheme.rowActive};
    }

    &:first-child {
        border-top-left-radius: ${props => props.theme.dimensions.borderRadius};
        border-top-right-radius: ${props => props.theme.dimensions.borderRadius};
    }

    &:last-child {
        border-bottom-left-radius: ${props => props.theme.dimensions.borderRadius};
        border-bottom-right-radius: ${props => props.theme.dimensions.borderRadius};
        border-bottom: none;
    }
`;

export const DropdownTextItem: React.FC<Props> = props => {
    const { text, onClick, ...restProps } = props;

    return (
        <DropdownTextItemWrapper onClick={onClick} {...restProps}>
            {text}
        </DropdownTextItemWrapper>
    );
};
