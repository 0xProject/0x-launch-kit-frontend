import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../themes/commons';

import { Footer } from './common/footer';
import { StepsModalContainer } from './common/steps_modal/steps_modal';

const General = styled.div`
    font-family: ${props => props.theme.componentsTheme.fontName};
    background: ${props => props.theme.componentsTheme.background};
    background-image: url(${props => props.theme.componentsTheme.backgroundImageUrl});
    background-repeat: repeat;
    display: flex;
    flex-direction: column;
    min-height: 100%;

    @media (min-width: ${themeBreakPoints.xl}) {
        height: 100%;
    }
`;

const ContentScroll = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    @media (min-width: ${themeBreakPoints.xl}) {
        height: calc(100% - ${props => props.theme.dimensions.toolbarHeight});
        overflow: auto;
    }
`;

interface OwnProps {
    children: React.ReactNode;
    toolbar: React.ReactNode;
}

type Props = OwnProps;

export const GeneralLayout = (props: Props) => {
    const { children, toolbar, ...restProps } = props;
    return (
        <General {...restProps}>
            {toolbar}
            <ContentScroll>
                {children}
                <Footer />
            </ContentScroll>
            <StepsModalContainer />
        </General>
    );
};
