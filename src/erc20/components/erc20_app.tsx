import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { ToolbarErc20Container } from '../../components/common/toolbar_erc20';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { Marketplace } from '../pages/marketplace';
import { MyWallet } from '../pages/my_wallet';

const Toolbar = <ToolbarErc20Container />;

export const Erc20App = () => (
    <GeneralLayoutContainer toolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
            <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
        </Switch>
    </GeneralLayoutContainer>
);
