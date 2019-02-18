import React from 'react';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { initWallet } from '../store/actions';

interface OwnProps {
    children: React.ReactNode;
}

interface DispatchProps {
    onInitWallet: () => any;
}

type Props = OwnProps & DispatchProps;

class App extends React.Component<Props> {
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
