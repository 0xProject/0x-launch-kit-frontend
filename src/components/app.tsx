import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { initWallet } from '../store/actions';

interface IAppOwnProps {
    children: React.ReactNode;
}

interface IPropsFromDispatch {
    onInitWallet: () => any;
}

type AppProps = IAppOwnProps & IPropsFromDispatch;

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
