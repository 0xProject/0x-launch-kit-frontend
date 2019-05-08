import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { CollectibleContainer } from '../pages/collectible';
import { MyCollectibles } from '../pages/my_collectibles';

const Toolbar = <ToolbarContainer />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={Toolbar}>
        <AdBlockDetector />
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={MyCollectibles} />
            <Route path={`${ERC721_APP_BASE_PATH}/asset/:id`} component={CollectibleContainer} />
        </Switch>
    </GeneralLayoutContainer>
);
