import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../util/theme';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';
import { ToolbarContainer } from './common/toolbar';

const General = styled.div`
    background: #f5f5f5;
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

interface GeneralLayoutProps {
    children: React.ReactChildren;
}

export const GeneralLayout = (props: React.Props<any> | GeneralLayoutProps) => {
    const { children } = props;

    return (
        <General>
            <ToolbarContainer />
            <ContentScroll>
                <Content>{children}</Content>
                <Footer />
            </ContentScroll>
            <StepsModalContainer />
        </General>
    );
};
