import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { themeDimensions } from '../../themes/ThemeCommons';
import { StoreState, StyledComponentThemeProps } from '../../util/types';

import { CardBaseContainer } from './card_base';

interface StateProps {
    themeColorsConfig: BasicTheme;
}
interface OwnProps {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}

type Props = OwnProps & StateProps;

const CardWrapper = styled(CardBaseContainer)`
    margin-bottom: 10px;
`;

const CardHeader = styled.div<StyledComponentThemeProps>`
    align-items: center;
    border-bottom: 1px solid ${props => props.themeColors.borderColor};
    display: flex;
    justify-content: space-between;
    padding: 15px ${themeDimensions.horizontalPadding};
`;

const CardTitle = styled.h1`
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
    padding: 0 20px 0 0;
`;

const CardBody = styled.div`
    margin: 0;
    min-height: 140px;
    overflow-x: auto;
    padding: ${themeDimensions.verticalPadding} ${themeDimensions.horizontalPadding};
    position: relative;
`;

const Card: React.FC<Props> = props => {
    const { title, action, children, themeColorsConfig, ...restProps } = props;

    return (
        <CardWrapper {...restProps}>
            {title || action ? (
                <CardHeader themeColors={themeColorsConfig}>
                    <CardTitle>{title}</CardTitle>
                    {action ? action : null}
                </CardHeader>
            ) : null}
            <CardBody>{children}</CardBody>
        </CardWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const CardContainer = connect(mapStateToProps)(Card);

export { Card, CardContainer };
