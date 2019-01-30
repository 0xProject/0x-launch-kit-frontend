import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { initWallet } from '../store/actions';

interface AppOwnProps {
    children: React.ReactNode;
}

interface PropsFromDispatch {
    onInitWallet: () => any;
}

type AppProps = AppOwnProps & PropsFromDispatch;

class App extends React.Component<AppProps> {
    public componentWillMount = () => {
        this.props.onInitWallet();
    };

    public render = () => this.props.children;
}

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        onInitWallet: () => dispatch(initWallet()),
    };
};

const AppContainer = connect(
    null,
    mapDispatchToProps,
)(App);

export { App, AppContainer };
