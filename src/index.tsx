import 'sanitize.css';
import './index.css';

import './icons';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { AppContainer } from './components/app';
import { ConnectedRouter } from 'connected-react-router';
import { GeneralLayout } from './components/GeneralLayout';
import { Marketplace } from './pages/marketplace';
import { MyWallet } from './pages/my_wallet';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { history, store } from './store/index';

ReactModal.setAppElement('#root');

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <GeneralLayout>
                    <Switch>
                        <Route exact={true} path="/" component={Marketplace} />
                        <Route exact={true} path="/my-wallet" component={MyWallet} />
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
