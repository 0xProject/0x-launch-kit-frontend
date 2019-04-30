import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { Marketplace } from '../pages/marketplace';
import { MyWallet } from '../pages/my_wallet';

const Toolbar = () => <ToolbarContainer />;

export const Erc20App = () => (
    <GeneralLayoutContainer renderToolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
        </Switch>
    </GeneralLayoutContainer>
);
