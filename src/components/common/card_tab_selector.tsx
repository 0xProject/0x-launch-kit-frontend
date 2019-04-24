import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { StoreState, StyledComponentThemeProps, TabItem } from '../../util/types';

interface StateProps {
    themeColorsConfig: BasicTheme;
}
interface OwnProps {
    tabs: TabItem[];
}

type Props = OwnProps & StateProps;

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

const CardTabSelector: React.FC<Props> = props => {
    const { tabs, themeColorsConfig, ...restProps } = props;

    return (
        <CardTabSelectorWrapper themeColors={themeColorsConfig} {...restProps}>
            {tabs.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <CardTabSelectorItem
                            themeColors={themeColorsConfig}
                            onClick={item.onClick}
                            active={item.active}
                        >
                            {item.text}
                        </CardTabSelectorItem>
                        <CardTabSelectorItemSeparator themeColors={themeColorsConfig}>/</CardTabSelectorItemSeparator>
                    </React.Fragment>
                );
            })}
        </CardTabSelectorWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const CardTabSelectorContainer = connect(mapStateToProps)(CardTabSelector);

export { CardTabSelector, CardTabSelectorContainer };
