import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC20APP_BASE_PATH } from '../../common/constants';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayout } from '../../components/general_layout';
import { Marketplace } from '../pages/marketplace';
import { MyWallet } from '../pages/my_wallet';

const Toolbar = () => <ToolbarContainer />;

export const Erc20App = () => (
    <GeneralLayout renderToolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC20APP_BASE_PATH}/`} component={Marketplace} />
            <Route exact={true} path={`${ERC20APP_BASE_PATH}/my-wallet`} component={MyWallet} />
        </Switch>
    </GeneralLayout>
);
