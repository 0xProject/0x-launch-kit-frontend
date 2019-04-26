import { HttpClient } from '@0x/connect';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { RELAYER_URL } from '../common/constants';

import { init } from './actions';
import { localStorageMiddleware } from './middleware/localStorage';
import { relayerMiddleware } from './middleware/relayer';
import { createWeb3Middleware } from './middleware/web3';
import { createRootReducer } from './reducers';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const client = new HttpClient(RELAYER_URL);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const web3Middleware = createWeb3Middleware({
    window,
    getWeb3Wrapper: provider => new Web3Wrapper(provider),
});

export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(
            thunk,
            relayerMiddleware(client),
            web3Middleware,
            localStorageMiddleware,
            routerMiddleware(history),
        ),
    ),
);

store.dispatch(init());
