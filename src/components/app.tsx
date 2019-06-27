import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { UI_UPDATE_CHECK_INTERVAL, UPDATE_ETHER_PRICE_INTERVAL } from '../common/constants';
import { LocalStorage } from '../services/local_storage';
import { initializeAppNoMetamaskOrLocked, initWallet, updateMarketPriceEther, updateMarketPriceQuote, updateStore } from '../store/actions';
import { getCurrentMarketPlace, getWeb3State } from '../store/selectors';
import { MARKETPLACES, StoreState, Web3State } from '../util/types';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
    MARKETPLACE: MARKETPLACES;
}

interface DispatchProps {
    onConnectWallet: () => any;
    onInitMetamaskState: () => any;
    onUpdateStore: () => any;
    onUpdateMarketPriceEther: () => any;
    onUpdateMarketPriceQuote: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

const localStorage = new LocalStorage(window.localStorage);

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;
    private _updatePriceEtherInterval: number | undefined;

    public componentDidMount = () => {
        const wasWalletConnected = localStorage.getWalletConnected();
        if (wasWalletConnected) {
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
        MARKETPLACE: getCurrentMarketPlace(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onInitMetamaskState: () => dispatch(initializeAppNoMetamaskOrLocked()),
        onUpdateStore: () => dispatch(updateStore()),
        onUpdateMarketPriceEther: () => dispatch(updateMarketPriceEther()),
        onUpdateMarketPriceQuote: () => dispatch(updateMarketPriceQuote()),
        onConnectWallet: () => dispatch(initWallet()),
    };
};

const AppContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(App) as any);

export { App, AppContainer };
