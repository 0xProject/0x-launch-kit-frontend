import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import {
    DEFAULT_BASE_PATH,
    ERC20_APP_BASE_PATH,
    ERC721_APP_BASE_PATH,
    MARKETPLACES,
    SHOULD_ENABLE_NO_METAMASK_PROMPT,
    UI_UPDATE_CHECK_INTERVAL,
    UPDATE_ETHER_PRICE_INTERVAL,
} from '../common/constants';
import { LocalStorage } from '../services/local_storage';
import {
    initializeAppNoMetamaskOrLocked,
    initWallet,
    setThemeByMarketplace,
    updateMarketPriceEther,
    updateStore,
} from '../store/actions';
import { getWeb3State } from '../store/selectors';
import { StoreState, Web3State } from '../util/types';

import { Erc20App } from './erc20/erc20_app';
import { Erc721App } from './erc721/erc721_app';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onConnectWallet: () => any;
    onInitMetamaskState: () => any;
    onUpdateStore: () => any;
    onUpdateMarketPriceEther: () => any;
    setThemeByMarketplace: (marketPlace: MARKETPLACES) => any;
}

type Props = OwnProps & DispatchProps & StateProps;

const localStorage = new LocalStorage(window.localStorage);

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;
    private _updatePriceEtherInterval: number | undefined;

    public componentDidMount = () => {
        const wasWalletConnected = localStorage.getWalletConnected();
        if (SHOULD_ENABLE_NO_METAMASK_PROMPT && wasWalletConnected) {
            this.props.onConnectWallet();
        } else {
            this.props.onInitMetamaskState();
        }
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<Props>, snapshot?: any) => {
        const { web3State } = this.props;
        if (web3State !== prevProps.web3State) {
            if (web3State === Web3State.Done) {
                this._activatePollingUpdates();
            } else {
                // If the user is currently using the dApp with the interval and the metamask status changed, the polling is removed
                this._deactivatePollingUpdates();
            }
        }
    };

    public componentWillUnmount = () => {
        clearInterval(this._updateStoreInterval);
        clearInterval(this._updatePriceEtherInterval);
    };

    public render = () => (
        <Switch>
            <Route
                path={ERC20_APP_BASE_PATH}
                /* tslint:disable-next-line:jsx-no-lambda */
                render={() => {
                    this.props.setThemeByMarketplace(MARKETPLACES.ERC20);
                    return <Erc20App />;
                }}
            />
            <Route
                path={ERC721_APP_BASE_PATH}
                /* tslint:disable-next-line:jsx-no-lambda */
                render={() => {
                    this.props.setThemeByMarketplace(MARKETPLACES.ERC721);
                    return <Erc721App />;
                }}
            />
            <Route component={this._RedirectToHome} />
        </Switch>
    );

    private readonly _RedirectToHome = () => <Redirect to={DEFAULT_BASE_PATH} />;

    private readonly _activatePollingUpdates = () => {
        // Enables realtime updates of the store using polling
        if (UI_UPDATE_CHECK_INTERVAL !== 0 && !this._updateStoreInterval) {
            this._updateStoreInterval = window.setInterval(async () => {
                this.props.onUpdateStore();
                this.setState({
                    isActiveCheckUpdates: true,
                });
            }, UI_UPDATE_CHECK_INTERVAL);
        }

        // Enables realtime updates of the price ether using polling
        if (!this._updatePriceEtherInterval && UPDATE_ETHER_PRICE_INTERVAL !== 0) {
            this._updatePriceEtherInterval = window.setInterval(async () => {
                this.props.onUpdateMarketPriceEther();
            }, UPDATE_ETHER_PRICE_INTERVAL);
        }
    };

    private readonly _deactivatePollingUpdates = () => {
        if (this._updateStoreInterval) {
            clearInterval(this._updateStoreInterval);
            this._updateStoreInterval = undefined;
        }

        if (this._updatePriceEtherInterval) {
            clearInterval(this._updatePriceEtherInterval);
            this._updatePriceEtherInterval = undefined;
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onInitMetamaskState: () => dispatch(initializeAppNoMetamaskOrLocked()),
        onUpdateStore: () => dispatch(updateStore()),
        onUpdateMarketPriceEther: () => dispatch(updateMarketPriceEther()),
        onConnectWallet: () => dispatch(initWallet()),
        setThemeByMarketplace: (marketplace: MARKETPLACES) => dispatch(setThemeByMarketplace(marketplace)),
    };
};

const AppContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App) as any);

export { App, AppContainer };
