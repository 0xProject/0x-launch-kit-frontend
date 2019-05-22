import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../themes/commons';

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
    padding: 12px ${themeDimensions.horizontalPadding};

    &:hover {
        background-color: ${props => props.theme.componentsTheme.rowActive};
    }

    &:first-child {
        border-top-left-radius: ${themeDimensions.borderRadius};
        border-top-right-radius: ${themeDimensions.borderRadius};
    }

    &:last-child {
        border-bottom-left-radius: ${themeDimensions.borderRadius};
        border-bottom-right-radius: ${themeDimensions.borderRadius};
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
