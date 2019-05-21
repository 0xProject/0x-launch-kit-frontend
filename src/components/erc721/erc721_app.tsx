import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../common/adblock_detector';
import { CheckMetamaskStateModalContainer } from '../common/check_metamask_state_modal_container';
import { GeneralLayoutContainer } from '../general_layout';

import { CollectibleListModal } from './collectibles/collectible_list_modal';
import { CollectibleSellModal } from './collectibles/collectible_sell_modal';
import { ToolbarContentContainer } from './common/toolbar_content';
import { AllCollectibles } from './pages/all_collectibles';
import { IndividualCollectible } from './pages/individual_collectible';
import { MyCollectibles } from './pages/my_collectibles';

const toolbar = <ToolbarContentContainer />;

export const Erc721App = () => (
    <GeneralLayoutContainer toolbar={toolbar}>
        <AdBlockDetector />
        <CollectibleSellModal />
        <CollectibleListModal />
        <CheckMetamaskStateModalContainer />
        <Switch>
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={AllCollectibles} />
            <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
            <Route path={`${ERC721_APP_BASE_PATH}/collectible/:id`}>
                {({ match }) => match && <IndividualCollectible collectibleId={match.params.id} />}
            </Route>
        </Switch>
    </GeneralLayoutContainer>
);
