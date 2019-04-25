import React from 'react';
import styled from 'styled-components';

import { StyledComponentThemeProps, TabItem } from '../../util/types';

interface Props extends StyledComponentThemeProps {
    tabs: TabItem[];
}

interface ItemProps extends StyledComponentThemeProps {
    active?: boolean;
}

const CardTabSelectorWrapper = styled.div<StyledComponentThemeProps>`
    align-items: center;
    color: ${props => props.themeColors.lightGray};
    display: flex;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    line-height: 1.2;
`;

const CardTabSelectorItem = styled.span<ItemProps>`
    color: ${props => (props.active ? '#000' : props.themeColors.lightGray)};
    cursor: ${props => (props.active ? 'default' : 'pointer')};
    user-select: none;
`;

const CardTabSelectorItemSeparator = styled.span<ItemProps>`
    color: #dedede;
    cursor: default;
    font-weight: 400;
    padding: 0 5px;
    user-select: none;

    &:last-child {
        display: none;
    }
`;

export const CardTabSelector: React.FC<Props> = props => {
    const { tabs, themeColors, ...restProps } = props;

    return (
        <CardTabSelectorWrapper themeColors={themeColors} {...restProps}>
            {tabs.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <CardTabSelectorItem themeColors={themeColors} onClick={item.onClick} active={item.active}>
                            {item.text}
                        </CardTabSelectorItem>
                        <CardTabSelectorItemSeparator themeColors={themeColors}>/</CardTabSelectorItemSeparator>
                    </React.Fragment>
                );
            })}
        </CardTabSelectorWrapper>
    );
};
