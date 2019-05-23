import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { GeneralLayout } from '../../components/general_layout';
import { setThemeColor } from '../../store/ui/actions';
import { Theme } from '../../themes/commons';
import { getThemeByRoute } from '../../themes/theme_meta_data_utils';

import { ToolbarContentContainer } from './common/toolbar_content';
import { Marketplace } from './pages/marketplace';
import { MyWallet } from './pages/my_wallet';

interface StateProps {
    theme: Theme;
}

interface DispatchProps {
    setThemeColor: (theme: Theme) => any;
}

type Props = StateProps & DispatchProps;

const toolbar = <ToolbarContentContainer />;

const Erc20AppContainer = (props: Props) => {
    const themeColor = getThemeByRoute(ERC20_APP_BASE_PATH);
    props.setThemeColor(themeColor);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayout toolbar={toolbar}>
                <AdBlockDetector />
                <Switch>
                    <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
                    <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
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

const Erc20App = connect(
    null,
    mapDispatchToProps,
)(Erc20AppContainer);

export { Erc20App, Erc20AppContainer };
