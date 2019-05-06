import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { IndividualAsset } from '../pages/individual_assets';
import { MyCollectibles } from '../pages/my_collectibles';

const Toolbar = <ToolbarContainer />;

export const Erc721App = () => (
    <>
        <GeneralLayoutContainer toolbar={Toolbar}>
            <Switch>
                <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={MyCollectibles} />
                <Route path={`${ERC721_APP_BASE_PATH}/asset/:id`} component={IndividualAsset} />
            </Switch>
        </GeneralLayoutContainer>
    </>
);