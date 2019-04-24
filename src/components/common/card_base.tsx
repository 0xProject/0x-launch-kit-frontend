import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { themeDimensions } from '../../themes/ThemeCommons';
import { StoreState, StyledComponentThemeProps } from '../../util/types';

interface OwnProps {
    children: React.ReactNode;
}
interface StateProps {
    themeColorsConfig: BasicTheme;
}

type Props = OwnProps & StateProps;

const CardWrapper = styled.div<StyledComponentThemeProps>`
    background-color: #fff;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.themeColors.borderColor};
`;

const CardBase: React.FC<Props> = props => {
    const { children, themeColorsConfig, ...restProps } = props;

    return (
        <CardWrapper themeColors={themeColorsConfig} {...restProps}>
            {children}
        </CardWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const CardBaseContainer = connect(mapStateToProps)(CardBase);

export { CardBase, CardBaseContainer };
