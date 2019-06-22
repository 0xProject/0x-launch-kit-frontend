import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType } from 'typesafe-actions';

import { LocalStorage } from '../services/local_storage';

import * as actions from './actions';
import { getEthAccount, getHasUnreadNotifications, getNotifications, getFills } from './selectors';
import { FEE_RECIPIENT } from '../common/constants';

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
            const notifications = getNotifications(state);
            const hasUnreadNotifications = getHasUnreadNotifications(state);
            localStorage.saveNotifications(notifications, ethAccount);
            localStorage.saveHasUnreadNotifications(hasUnreadNotifications, ethAccount);
            break;
        }
        case getType(actions.setNotifications): {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const notifications = getNotifications(state);
            localStorage.saveNotifications(notifications, ethAccount);

            break;
        }
        case getType(actions.addFills): {
            const state = getState();
            const ethAccount = FEE_RECIPIENT;
            const fills = getFills(state);
    
            localStorage.saveFills(fills, ethAccount);
    
            break;
        }
        case getType(actions.setFills): {
            const state = getState();
            const ethAccount = FEE_RECIPIENT;
            const fills = getFills(state);
            localStorage.saveFills(fills, ethAccount);

            break;
        }




        default:
            return result;
    }
};
