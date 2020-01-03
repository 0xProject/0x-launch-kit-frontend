import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
    UI_UPDATE_CHECK_INTERVAL,
    UPDATE_ERC20_MARKETS,
    UPDATE_ETHER_PRICE_INTERVAL,
    UPDATE_TOKENS_PRICE_INTERVAL,
    VERIDEX_ORIGIN,
} from '../common/constants';
import { LocalStorage } from '../services/local_storage';
import * as serviceWorker from '../serviceWorker';
import {
    initConfigData,
    initializeAppWallet,
    initTheme,
    initWallet,
    updateERC20Markets,
    updateMarketPriceEther,
    updateMarketPriceQuote,
    updateMarketPriceTokens,
    updateStore,
} from '../store/actions';
import { getCurrentMarketPlace, getWeb3State } from '../store/selectors';
import { MARKETPLACES, StoreState, Wallet, Web3State } from '../util/types';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
    MARKETPLACE: MARKETPLACES;
}

interface DispatchProps {
    onConnectWallet: (wallet: Wallet) => any;
    onInitTheme: (themeName: string | null) => any;
    onInitConfig: (name: string | undefined, domain: string | undefined) => any;
    onInitWalletState: () => any;
    onUpdateStore: () => any;
    onUpdateMarketPriceEther: () => any;
    onUpdateMarketPriceQuote: () => any;
    onUpdateMarketPriceTokens: () => any;
    onUpdateERC20Markets: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

const localStorage = new LocalStorage(window.localStorage);

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;
    private _updatePriceEtherInterval: number | undefined;
    private _updatePriceTokensInterval: number | undefined;
    private _updateERC20MarketsInterval: number | undefined;

    public componentDidMount = () => {
        const { MARKETPLACE, onInitConfig, onInitTheme } = this.props;
        // no need to init when instant is the marketplace
        // Check if any config is requested
        const parsedUrl = new URL(window.location.href.replace('#/', ''));
        const dex = parsedUrl.searchParams.get('dex');
        const origin = window.location.origin;
        if (origin !== VERIDEX_ORIGIN) {
            onInitConfig(undefined, origin);
        } else if (dex) {
            onInitConfig(dex, undefined);
        } else {
            const themeName = localStorage.getThemeName();
            //  console.log(themeName);
            onInitTheme(themeName);
        }
        if (MARKETPLACE === MARKETPLACES.Instant || MARKETPLACE === MARKETPLACES.FiatRamp) {
            serviceWorker.unregister();
            return;
        }

        // this.props.onInitWalletState();
        const walletConnected = localStorage.getWalletConnected();
        if (walletConnected !== false && walletConnected !== undefined) {
            this.props.onConnectWallet(walletConnected as Wallet);
        } else {
            this.props.onInitWalletState();
        }
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<Props>, snapshot?: any) => {
        const { web3State, MARKETPLACE } = this.props;
        // no need to init when instant is the marketplace
        if (MARKETPLACE === MARKETPLACES.Instant || MARKETPLACE === MARKETPLACES.FiatRamp) {
            serviceWorker.unregister();
            return;
        }
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

    public render = () => this.props.children;

    private readonly _activatePollingUpdates = () => {
        const { MARKETPLACE } = this.props;
        // Enables realtime updates of the store using polling
        if (UI_UPDATE_CHECK_INTERVAL !== 0 && !this._updateStoreInterval) {
            this._updateStoreInterval = window.setInterval(async () => {
                this.props.onUpdateStore();
                this.setState({
                    isActiveCheckUpdates: true,
                });
            }, UI_UPDATE_CHECK_INTERVAL);
        }

        // Enables realtime updates of the price ether and quote token using polling
        if (!this._updatePriceEtherInterval && UPDATE_ETHER_PRICE_INTERVAL !== 0) {
            this._updatePriceEtherInterval = window.setInterval(async () => {
                this.props.onUpdateMarketPriceEther();
                if (MARKETPLACE === MARKETPLACES.ERC20) {
                    this.props.onUpdateMarketPriceQuote();
                }
            }, UPDATE_ETHER_PRICE_INTERVAL);
        }
        // Enables realtime updates of token prices
        if (
            !this._updatePriceTokensInterval &&
            UPDATE_TOKENS_PRICE_INTERVAL !== 0 &&
            (MARKETPLACE === MARKETPLACES.ERC20 || MARKETPLACE === MARKETPLACES.Margin)
        ) {
            this._updatePriceTokensInterval = window.setInterval(async () => {
                this.props.onUpdateMarketPriceTokens();
            }, UPDATE_TOKENS_PRICE_INTERVAL);
        }
        // Enables realtime updates of the token markets
        if (!this._updateERC20MarketsInterval && UPDATE_ERC20_MARKETS !== 0 && MARKETPLACE === MARKETPLACES.ERC20) {
            this._updateERC20MarketsInterval = window.setInterval(async () => {
                this.props.onUpdateERC20Markets();
            }, UPDATE_ERC20_MARKETS);
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
        if (this._updatePriceTokensInterval) {
            clearInterval(this._updatePriceTokensInterval);
            this._updatePriceTokensInterval = undefined;
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        MARKETPLACE: getCurrentMarketPlace(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onInitWalletState: () => dispatch(initializeAppWallet()),
        onInitTheme: (themeName: string | null) => dispatch(initTheme(themeName)),
        onUpdateStore: () => dispatch(updateStore()),
        onUpdateMarketPriceEther: () => dispatch(updateMarketPriceEther()),
        onUpdateMarketPriceQuote: () => dispatch(updateMarketPriceQuote()),
        onUpdateMarketPriceTokens: () => dispatch(updateMarketPriceTokens()),
        onUpdateERC20Markets: () => dispatch(updateERC20Markets()),
        onConnectWallet: (wallet: Wallet) => dispatch(initWallet(wallet)),
        onInitConfig: (name: string | undefined, domain: string | undefined) => dispatch(initConfigData(name, domain)),
    };
};

const AppContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(App) as any);

export { App, AppContainer };
