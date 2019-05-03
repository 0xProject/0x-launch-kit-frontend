import React from 'react';
import { connect } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';

import { getTheme } from '../store/selectors';
import { Theme, themeBreakPoints } from '../themes/commons';
import { StoreState } from '../util/types';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';

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
    theme: Theme;
}

interface OwnProps {
    children: React.ReactNode;
    toolbar: React.ReactNode;
}

type Props = OwnProps & StateProps;

export const GeneralLayout = (props: Props) => {
    const { children, toolbar, theme } = props;
    return (
        <ThemeProvider theme={theme}>
            <General>
                {toolbar}
                <ContentScroll>
                    <Content>{children}</Content>
                    <Footer />
                </ContentScroll>
                <StepsModalContainer/>
            </General>
        </ThemeProvider>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        theme: getTheme(state),
    };
};

export const GeneralLayoutContainer = connect(mapStateToProps)(GeneralLayout);
