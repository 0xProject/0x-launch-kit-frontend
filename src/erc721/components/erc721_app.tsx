import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { ToolbarErc721Container } from '../../components/common/toolbar_erc721';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { Collectibles } from '../pages/collectibles';
import { MyCollectiblesContainer } from '../pages/my_collectibles';

const Toolbar = <ToolbarErc721Container />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={Collectibles} />
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectiblesContainer} />
        </Switch>
    </GeneralLayoutContainer>
);
