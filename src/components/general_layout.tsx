import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../themes/commons';

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
