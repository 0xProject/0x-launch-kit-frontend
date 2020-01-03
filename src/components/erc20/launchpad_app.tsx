import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { LAUNCHPAD_APP_BASE_PATH } from '../../common/constants';
import { getERC20Theme } from '../../store/selectors';
import { AdBlockDetector } from '../common/adblock_detector';
import { PageLoading } from '../common/page_loading';
import { GeneralLayoutContainer } from '../general_layout';

import ToolbarContentContainer from './common/toolbar_content';
const toolbar = <ToolbarContentContainer />;

const IEOPage = lazy(() => import('./pages/ieo'));
const IEOOrdersPage = lazy(() => import('./pages/ieo_orders'));

const LaunchpadApp = () => {
    const themeColor = useSelector(getERC20Theme);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Suspense fallback={<PageLoading />}>
                    <Switch>
                        <Route exact={true} path={`${LAUNCHPAD_APP_BASE_PATH}/orders`} component={IEOOrdersPage} />
                        <Route exact={true} path={`${LAUNCHPAD_APP_BASE_PATH}/tokens`} component={IEOPage} />
                    </Switch>
                </Suspense>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};

export { LaunchpadApp as default };
