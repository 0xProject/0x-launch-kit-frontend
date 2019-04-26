import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721APP_BASE_PATH } from '../../common/constants';
import { ToolbarContainer } from '../../components/common/toolbar';
import { GeneralLayout } from '../../components/general_layout';
import { MyCollectibles } from '../pages/my_collectibles';

const Toolbar = () => <ToolbarContainer />;

export const Erc721App = () => (
    <GeneralLayout renderToolbar={Toolbar}>
        <Switch>
            <Route exact={true} path={`${ERC721APP_BASE_PATH}/`} component={MyCollectibles} />
        </Switch>
    </GeneralLayout>
);
