import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { MARGIN_APP_BASE_PATH } from '../../common/constants';
import { getERC20Theme } from '../../store/selectors';
import { AdBlockDetector } from '../common/adblock_detector';
import { PageLoading } from '../common/page_loading';
import { GeneralLayoutContainer } from '../general_layout';

import ToolbarContentContainer from './common/toolbar_content';

const toolbar = <ToolbarContentContainer />;

const LendingPage = React.lazy(() => import('./pages/lending'));

export const MarginApp = () => {
    const themeColor = useSelector(getERC20Theme);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Suspense fallback={<PageLoading />}>
                    <Switch>
                        <Route exact={true} path={`${MARGIN_APP_BASE_PATH}/lend`} component={LendingPage} />
                    </Switch>
                </Suspense>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};

export { MarginApp as default };
