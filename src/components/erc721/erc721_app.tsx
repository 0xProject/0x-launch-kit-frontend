import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../common/constants';
import { setThemeColor } from '../../store/ui/actions';
import { Theme } from '../../themes/commons';
import { getThemeByRoute } from '../../themes/theme_meta_data_utils';
import { AdBlockDetector } from '../common/adblock_detector';
import { CheckMetamaskStateModalContainer } from '../common/check_metamask_state_modal_container';
import { GeneralLayout } from '../general_layout';

import { CollectibleSellModal } from './collectibles/collectible_sell_modal';
import { ToolbarContentContainer } from './common/toolbar_content';
import { AllCollectibles } from './pages/all_collectibles';
import { IndividualCollectible } from './pages/individual_collectible';
import { MyCollectibles } from './pages/my_collectibles';

interface StateProps {
    theme: Theme;
}

interface DispatchProps {
    setThemeColor: (theme: Theme) => any;
}

type Props = StateProps & DispatchProps;

const toolbar = <ToolbarContentContainer />;

const Erc721AppContainer = (props: Props) => {
    const themeColor = getThemeByRoute(ERC721_APP_BASE_PATH);
    props.setThemeColor(themeColor);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayout toolbar={toolbar}>
                <AdBlockDetector />
                <CollectibleSellModal />
                <CheckMetamaskStateModalContainer />
                <Switch>
                    <Route exact={true} path={`${ERC721_APP_BASE_PATH}/`} component={AllCollectibles} />
                    <Route exact={true} path={`${ERC721_APP_BASE_PATH}/my-collectibles`} component={MyCollectibles} />
                    <Route path={`${ERC721_APP_BASE_PATH}/collectible/:id`}>
                        {({ match }) => match && <IndividualCollectible collectibleId={match.params.id} />}
                    </Route>
                </Switch>
            </GeneralLayout>
        </ThemeProvider>
    );
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        setThemeColor: (theme: Theme) => dispatch(setThemeColor(theme)),
    };
};

const Erc721App = connect(
    null,
    mapDispatchToProps,
)(Erc721AppContainer);

export { Erc721App, Erc721AppContainer };
