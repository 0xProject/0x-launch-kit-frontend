import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UI_UPDATE_CHECK_INTERVAL } from '../common/constants';
import { initWallet, updateStore } from '../store/actions';

interface OwnProps {
    children: React.ReactNode;
}

interface DispatchProps {
    onInitWallet: () => any;
    onUpdateStore: () => any;
}

type Props = OwnProps & DispatchProps;

class App extends React.Component<Props> {
    private _updateStoreInterval: number | undefined;

    public componentWillMount = () => {
        this.props.onInitWallet();
        /* Enables realtime updates of the store using pooling */
        if (!this._updateStoreInterval) {
            this._updateStoreInterval = window.setInterval(async () => {
                this.props.onUpdateStore();
                this.setState({
                    isActiveCheckUpdates: true,
                });
            }, UI_UPDATE_CHECK_INTERVAL);
        }
    };

    public componentWillUnmount = () => {
        clearInterval(this._updateStoreInterval);
    };

    public render = () => this.props.children;
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onInitWallet: () => dispatch(initWallet()),
        onUpdateStore: () => dispatch(updateStore()),
    };
};

const AppContainer = connect(
    null,
    mapDispatchToProps,
)(App);

export { App, AppContainer };
