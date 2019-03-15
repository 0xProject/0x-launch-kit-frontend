import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UI_UPDATE_CHECK_INTERVAL } from '../common/constants';
import { initWallet, updateStore } from '../store/actions';
import { getWeb3State } from '../store/selectors';
import { StoreState, Web3State } from '../util/types';

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onInitWallet: () => any;
    onUpdateStore: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;

    public componentWillMount = () => {
        this.props.onInitWallet();
    };

    public componentDidUpdate = async (prevProps: Readonly<Props>, prevState: Readonly<Props>, snapshot?: any) => {
        const { web3State, children } = this.props;
        if (web3State !== prevProps.web3State || children !== prevProps.children) {
            switch (web3State) {
                case Web3State.Done: {
                    /* Enables realtime updates of the store using pooling */
                    if (!this._updateStoreInterval) {
                        this._updateStoreInterval = window.setInterval(async () => {
                            this.props.onUpdateStore();
                            this.setState({
                                isActiveCheckUpdates: true,
                            });
                        }, UI_UPDATE_CHECK_INTERVAL);
                    }
                    break;
                }
                case Web3State.NotInstalled: {
                    /* If the user is currently using the dApp, uninstalls metamask, the polling is removed **/
                    if (this._updateStoreInterval) {
                        clearInterval(this._updateStoreInterval);
                    }
                    break;
                }
            }
        }
    };

    public componentWillUnmount = () => {
        clearInterval(this._updateStoreInterval);
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
        onInitWallet: () => dispatch(initWallet()),
        onUpdateStore: () => dispatch(updateStore()),
    };
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);

export { App, AppContainer };
