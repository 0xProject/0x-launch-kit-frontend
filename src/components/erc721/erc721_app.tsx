import React from 'react';
import { Route, Switch } from 'react-router';
import styled, { ThemeProvider } from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { getThemeByMarketplace } from '../../themes/theme_meta_data_utils';
import { MARKETPLACES } from '../../util/types';
import { AdBlockDetector } from '../common/adblock_detector';
import { CheckMetamaskStateModalContainer } from '../common/check_metamask_state_modal_container';
import { GeneralLayout } from '../general_layout';

import { CollectibleSellModal } from './collectibles/collectible_sell_modal';
import { ToolbarContentContainer } from './common/toolbar_content';
import { AllCollectibles } from './pages/all_collectibles';
import { IndividualCollectible } from './pages/individual_collectible';
import { ListCollectibles } from './pages/list_collectibles';
import { MyCollectibles } from './pages/my_collectibles';

const toolbar = <ToolbarContentContainer />;

const GeneralLayoutERC721 = styled(GeneralLayout)`
    background-color: ${props => props.theme.componentsTheme.backgroundERC721};
`;

export const Erc721App = () => {
    const themeColor = getThemeByMarketplace(MARKETPLACES.ERC721);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutERC721 toolbar={toolbar}>
                <AdBlockDetector />
                <CollectibleSellModal />
                <CheckMetamaskStateModalContainer />
                <Switch>
                    <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={AllCollectibles} />
                    <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
                    <Route
                        exact={true}
                        path={`${ERC721_APP_BASE_PATH}/list-collectibles`}
                        component={ListCollectibles}
                    />
                    <Route path={`${ERC721_APP_BASE_PATH}/collectible/:id`}>
                        {({ match }) => match && <IndividualCollectible collectibleId={match.params.id} />}
                    </Route>
                </Switch>
            </GeneralLayoutERC721>
        </ThemeProvider>
    );
};
