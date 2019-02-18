import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { TabItem } from '../../util/types';

interface Props extends HTMLAttributes<HTMLDivElement> {
    tabs: TabItem[];
}

interface ItemProps {
    active?: boolean;
}

const CardTabSelectorWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const CardTabSelectorItem = styled.span<ItemProps>`
    color: ${props => (props.active ? '#000' : '#ccc')};
    cursor: ${props => (props.active ? 'default' : 'pointer')};

    &:after {
        color: #ccc;
        content: '/';
        padding: 0 10px;
    }

    &:last-child:after {
        display: none;
    }
`;

export const CardTabSelector: React.FC<Props> = props => {
    const { tabs } = props;

    return (
        <CardTabSelectorWrapper>
            {tabs.map((item, index) => {
                return <CardTabSelectorItem key={index} onClick={item.onClick} active={item.active}>{item.text}</CardTabSelectorItem>;
            })}
        </CardTabSelectorWrapper>);
};
