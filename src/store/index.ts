import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { AnyAction, applyMiddleware, compose, createStore } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';

import { getCollectiblesMetadataSource } from '../services/collectibles/collectibles_metadata_source';
import { getContractWrappers } from '../services/contract_wrappers';
import { getWeb3Wrapper, initializeWeb3Wrapper } from '../services/web3_wrapper';
import { StoreState } from '../util/types';

import { localStorageMiddleware } from './middlewares';
import { createRootReducer } from './reducers';

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

const extraArgument = {
    getContractWrappers,
    getWeb3Wrapper,
    initializeWeb3Wrapper,
    getCollectiblesMetadataSource,
};
export type ExtraArgument = typeof extraArgument;

const thunkMiddleware = thunk.withExtraArgument(extraArgument) as ThunkMiddleware<StoreState, AnyAction>;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunkMiddleware, localStorageMiddleware, routerMiddleware(history))),
);
