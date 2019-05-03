import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { Collectibles } from '../pages/collectibles';
import { MyCollectibles } from '../pages/my_collectibles';

const Toolbar = <ToolbarContainer />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={Collectibles} />
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
        </Switch>
    </GeneralLayoutContainer>
);
