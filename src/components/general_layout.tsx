import React from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';

import { getThemeColors } from '../store/selectors';
import { themeBreakPoints } from '../themes/commons';
import { DefaultTheme } from '../themes/default_theme';
import { StoreState } from '../util/types';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';
import { ToolbarContainer } from './common/toolbar';

const General = styled.div`
    background: ${props => props.theme.componentsTheme.background};
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
    themeColors: DefaultTheme;
}

interface OwnProps {
    children: React.ReactNode;
}

type Props = OwnProps & StateProps;

const GeneralLayout = (props: Props) => {
    const { themeColors, children } = props;
    return (
        <ThemeProvider theme={themeColors}>
            <General>
                <ToolbarContainer />
                <ContentScroll>
                    <Content>{children}</Content>
                    <Footer />
                </ContentScroll>
                <StepsModalContainer />
            </General>
        </ThemeProvider>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColors: getThemeColors(state),
    };
};

const GeneralLayoutContainer = connect(mapStateToProps)(GeneralLayout);

export { GeneralLayout, GeneralLayoutContainer };
