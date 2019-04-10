import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import 'sanitize.css';

import { AppContainer } from './components/app';
import { AdBlockDetector } from './components/common/adblock_detector';
import { GeneralLayout } from './components/general_layout';
import './icons';
import './index.css';
import { Marketplace } from './pages/marketplace';
import { MyWallet } from './pages/my_wallet';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';

ReactModal.setAppElement('#root');
const RedirectToHome = () => <Redirect to="/" />;

if (process.env.NODE_ENV === 'development' && !window.localStorage.debug) {
    // Log everything to the console
    window.localStorage.debug = '*';
}

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <AdBlockDetector />
                <GeneralLayout>
                    <Switch>
                        <Route exact={true} path="/" component={Marketplace} />
                        <Route exact={true} path="/my-wallet" component={MyWallet} />
                        <Route component={RedirectToHome} />
                    </Switch>
                </GeneralLayout>
            </AppContainer>
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(Web3WrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
