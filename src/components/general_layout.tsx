import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints, themeDimensions } from '../themes/commons';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';

const General = styled.div`
    background: ${props => props.theme.componentsTheme.background};
    display: flex;
    flex-direction: column;

    @media (min-width: ${themeBreakPoints.xl}) {
        height: 100%;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 10px;

    @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: row;
        height: calc(100% - ${themeDimensions.footerHeight});
    }
`;

const ContentScroll = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @media (min-width: ${themeBreakPoints.xl}) {
        height: calc(100% - ${themeDimensions.toolbarHeight});
        overflow: auto;
    }
`;

interface OwnProps {
    children: React.ReactNode;
    toolbar: React.ReactNode;
}

type Props = OwnProps;

export const GeneralLayout = (props: Props) => {
    const { children, toolbar } = props;
    return (
        <General>
            {toolbar}
            <ContentScroll>
                <Content>{children}</Content>
                <Footer />
            </ContentScroll>
            <StepsModalContainer />
        </General>
    );
};
