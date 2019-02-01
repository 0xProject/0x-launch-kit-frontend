import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import 'sanitize.css';

import { AppContainer } from './components/app';
import { Marketplace } from './pages/marketplace';
import { MyWallet } from './pages/my_wallet';
import * as serviceWorker from './serviceWorker';
import { createRootReducer } from './store/reducers';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const store = createStore(rootReducer, applyMiddleware(thunk));

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <Switch>
                    <Route exact={true} path="/" component={Marketplace} />
                    <Route exact={true} path="/my-wallet" component={MyWallet} />
                </Switch>
            </AppContainer>
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(Web3WrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
