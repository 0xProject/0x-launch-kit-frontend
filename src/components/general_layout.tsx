import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../store/selectors';
import { themeBreakPoints } from '../util/theme';
import { StoreState, ThemeColors } from '../util/types';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';
import { ToolbarContainer } from './common/toolbar';

const General = styled.div<{ themeColors: ThemeColors }>`
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
    themeColorsConfig: ThemeColors;
}

interface GeneralLayoutProps {
    children: React.ReactChildren;
}

type Props = StateProps & GeneralLayoutProps;

class GeneralLayout extends React.Component<Props> {
    public render = () => {
        const { children, themeColorsConfig } = this.props;
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
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const GeneralLayoutContainer = connect(mapStateToProps)(GeneralLayout);

export { GeneralLayout, GeneralLayoutContainer };
