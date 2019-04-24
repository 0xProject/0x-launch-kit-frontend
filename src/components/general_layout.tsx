import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../store/selectors';
import { BasicTheme } from '../themes/BasicTheme';
import { themeBreakPoints } from '../themes/ThemeCommons';
import { StoreState } from '../util/types';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';
import { ToolbarContainer } from './common/toolbar';

const General = styled.div<{ themeColors: BasicTheme }>`
    background: ${props => props.themeColors.background};
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: fit-content;
    padding: 10px;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: row;
    }
`;

const ContentScroll = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
`;

interface StateProps {
    themeColorsConfig: BasicTheme;
}
interface OwnProps {
    children: React.ReactNode;
}

type Props = OwnProps & StateProps;

const GeneralLayout = (props: Props) => {
    const { themeColorsConfig, children } = props;
    return (
        <General themeColors={themeColorsConfig}>
            <ToolbarContainer />
            <ContentScroll>
                <Content>{children}</Content>
                <Footer />
            </ContentScroll>
            <StepsModalContainer />
        </General>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const GeneralLayoutContainer = connect(mapStateToProps)(GeneralLayout);

export { GeneralLayout, GeneralLayoutContainer };
