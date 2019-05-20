import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { localStorageMiddleware } from './middlewares';
import { createRootReducer } from './reducers';

const publicURLPath = (path: string): string => {
    const publicUrl = process.env.PUBLIC_URL || '';
    if (publicUrl.startsWith('http')) {
        const url = new URL(publicUrl);
        const pathname = url.pathname;
        return `${pathname}/${path}`.replace(/\/\//g, '/');
    }
    return path;
};

export const history = createBrowserHistory({ basename: publicURLPath('/') });
const rootReducer = createRootReducer(history);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk, localStorageMiddleware, routerMiddleware(history))),
);
