import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router';

import { INSTANT_APP_BASE_PATH } from '../../common/constants';
import { PageLoading } from '../common/page_loading';

import InstantPage from './pages/instant';

export const InstantApp = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <Switch>
                <Route exact={true} path={`${INSTANT_APP_BASE_PATH}`} component={InstantPage} />
            </Switch>
        </Suspense>
    );
};

export { InstantApp as default };
