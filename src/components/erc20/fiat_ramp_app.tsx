import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router';

import { FIAT_RAMP_APP_BASE_PATH } from '../../common/constants';
import { PageLoading } from '../common/page_loading';

import FiatRampPage from './pages/fiat_ramp';

export const FiatRampApp = () => {
    return (
        <Suspense fallback={<PageLoading />}>
            <Switch>
                <Route exact={true} path={`${FIAT_RAMP_APP_BASE_PATH}`} component={FiatRampPage} />
            </Switch>
        </Suspense>
    );
};

export { FiatRampApp as default };
