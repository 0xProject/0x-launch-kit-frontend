import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { enableRealtimeUpdates } from '../util/store-updates';

import { createRootReducer } from './reducers';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
/* Enables realtime updates of the store using pooling */
enableRealtimeUpdates();
