import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType } from 'typesafe-actions';

import { LocalStorage } from '../services/local_storage';

import * as actions from './actions';
import { getEthAccount, getHasUnreadNotifications, getNetworkId, getNotifications } from './selectors';

const localStorage = new LocalStorage(window.localStorage);

export const localStorageMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (next: Dispatch) => (
    action: any,
) => {
    const result = next(action);
    switch (action.type) {
        case getType(actions.setHasUnreadNotifications):
        case getType(actions.addNotifications): {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const networkId = getNetworkId(state);
            const notifications = getNotifications(state);
            const hasUnreadNotifications = getHasUnreadNotifications(state);
            localStorage.saveNotifications(notifications, ethAccount, networkId);
            localStorage.saveHasUnreadNotifications(hasUnreadNotifications, ethAccount, networkId);
            break;
        }
        case getType(actions.setNotifications): {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const networkId = getNetworkId(state);
            const notifications = getNotifications(state);
            localStorage.saveNotifications(notifications, ethAccount, networkId);
            break;
        }
    }

    return result;
};
