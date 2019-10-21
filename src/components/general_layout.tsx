import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from 'react-sidebar';
import styled from 'styled-components';

import { getSideBarOpenState } from '../store/selectors';
import { openSideBar } from '../store/ui/actions';
import { themeBreakPoints, themeDimensions } from '../themes/commons';
import { isMobile } from '../util/screen';

import { Footer } from './common/footer';
import { withWindowWidth } from './common/hoc/withWindowWidth';
import { StepsModalContainer } from './common/steps_modal/steps_modal';
import { MobileWalletConnectionContent } from './erc20/account/mobile_wallet_connection_content';

const General = styled.div`
    background: ${props => props.theme.componentsTheme.background};
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
        height: calc(100% - ${themeDimensions.toolbarHeight});
        overflow: auto;
    }
`;

interface OwnProps {
    children: React.ReactNode;
    toolbar: React.ReactNode;
    windowWidth: number;
}

type Props = OwnProps;

export const GeneralLayout = (props: Props) => {
    const { children, toolbar, windowWidth, ...restProps } = props;
    const dispatch = useDispatch();

    const setSidebarOpen = (isOpen: boolean) => {
        dispatch(openSideBar(isOpen));
    };
    const isSidebarOpen = useSelector(getSideBarOpenState);

    if (isMobile(props.windowWidth)) {
        return (
            <Sidebar
                sidebar={<MobileWalletConnectionContent />}
                open={isSidebarOpen}
                onSetOpen={setSidebarOpen}
                styles={{ sidebar: { zIndex: '1000', top: '-10px' } }}
            >
                <General {...restProps}>
                    {toolbar}
                    <ContentScroll>
                        {children}
                        <Footer />
                    </ContentScroll>
                    <StepsModalContainer />
                </General>
            </Sidebar>
        );
    } else {
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
    }
};

export const GeneralLayoutContainer = withWindowWidth(GeneralLayout);
