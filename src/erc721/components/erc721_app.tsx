import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { ToolbarErc721Container } from '../../components/common/toolbar_erc721';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { Collection } from '../pages/collection';
import { MyCollectibles } from '../pages/my_collectibles';

const Toolbar = <ToolbarErc721Container />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={Collection} />
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
        </Switch>
    </GeneralLayoutContainer>
);
