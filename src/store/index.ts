import { HttpClient } from '@0x/connect';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { RELAYER_URL } from '../common/constants';

import { localStorageMiddleware } from './middleware/localStorage';
import { relayerMiddleware } from './middleware/relayer';
import { createRootReducer } from './reducers';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const client = new HttpClient(RELAYER_URL);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk, relayerMiddleware(client), localStorageMiddleware, routerMiddleware(history)),
    ),
);
