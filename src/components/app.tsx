import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UI_UPDATE_CHECK_INTERVAL, UPDATE_ETHER_PRICE_INTERVAL } from '../common/constants';
import { initMetamaskState, updateMarketPriceEther, updateStore } from '../store/actions';
import { getWeb3State } from '../store/selectors';
import { StoreState, Web3State } from '../util/types';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onInitMetamaskState: () => any;
    onUpdateStore: () => any;
    onUpdateMarketPriceEther: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;
    private _updatePriceEtherInterval: number | undefined;

    public componentDidMount = () => {
        this.props.onInitMetamaskState();
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<Props>, snapshot?: any) => {
        const { web3State } = this.props;
        if (web3State !== prevProps.web3State) {
            if (web3State === Web3State.Done) {
                // Enables realtime updates of the store using polling
                if (!this._updateStoreInterval) {
                    this._updateStoreInterval = window.setInterval(async () => {
                        this.props.onUpdateStore();
                        this.setState({
                            isActiveCheckUpdates: true,
                        });
                    }, UI_UPDATE_CHECK_INTERVAL);
                }

                // Enables realtime updates of the price ether using polling
                if (!this._updatePriceEtherInterval) {
                    this._updatePriceEtherInterval = window.setInterval(async () => {
                        this.props.onUpdateMarketPriceEther();
                    }, UPDATE_ETHER_PRICE_INTERVAL);
                }
            } else {
                // If the user is currently using the dApp with the interval and he change the metamask status, the polling is removed
                if (this._updateStoreInterval) {
                    clearInterval(this._updateStoreInterval);
                    this._updateStoreInterval = undefined;
                }

                if (this._updatePriceEtherInterval) {
                    clearInterval(this._updatePriceEtherInterval);
                    this._updatePriceEtherInterval = undefined;
                }
            }
        }
    };

    public componentWillUnmount = () => {
        clearInterval(this._updateStoreInterval);
        clearInterval(this._updatePriceEtherInterval);
    };

    public render = () => this.props.children;
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onInitMetamaskState: () => dispatch(initMetamaskState()),
        onUpdateStore: () => dispatch(updateStore()),
        onUpdateMarketPriceEther: () => dispatch(updateMarketPriceEther()),
    };
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

export { App, AppContainer };
