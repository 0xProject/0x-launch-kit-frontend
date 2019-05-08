import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { GeneralLayoutContainer } from '../../components/general_layout';

import { ToolbarContentContainer } from './common/toolbar_content';
import { MyCollectibles } from './pages/my_collectibles';
import { Collectibles } from './pages/collectibles';

const toolbar = <ToolbarContentContainer />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={toolbar}>
        <AdBlockDetector />
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={Collectibles} />
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
        </Switch>
    </GeneralLayoutContainer>
);
