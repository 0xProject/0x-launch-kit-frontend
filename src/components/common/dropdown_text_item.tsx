import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { themeDimensions } from '../../themes/ThemeCommons';
import { StoreState, StyledComponentThemeProps } from '../../util/types';

interface StateProps {
    themeColorsConfig: BasicTheme;
}
interface OwnProps {
    active?: boolean;
    onClick?: any;
    text: string;
}

interface StyledIsActive extends StyledComponentThemeProps {
    active?: boolean;
}

type Props = OwnProps & StateProps;

const DropdownTextItemWrapper = styled.div<StyledIsActive>`
    background-color: ${props => (props.active ? props.themeColors.rowActive : '#fff')};
    border-bottom: 1px solid ${props => props.themeColors.borderColor};
    color: #000;
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.3;

    padding: 12px ${themeDimensions.horizontalPadding};

    &:hover {
        background-color: ${props => props.themeColors.rowActive};
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

const DropdownTextItem: React.FC<Props> = props => {
    const { text, onClick, themeColorsConfig, ...restProps } = props;

    return (
        <DropdownTextItemWrapper onClick={onClick} themeColors={themeColorsConfig} {...restProps}>
            {text}
        </DropdownTextItemWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const DropdownTextItemContainer = connect(mapStateToProps)(DropdownTextItem);

export { DropdownTextItem, DropdownTextItemContainer };
