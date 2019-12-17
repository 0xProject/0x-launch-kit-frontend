import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { getType } from 'typesafe-actions';

import { FEE_RECIPIENT } from '../common/constants';
import { LocalStorage } from '../services/local_storage';

import * as actions from './actions';
import {
    getEthAccount,
    getFills,
    getHasUnreadNotifications,
    getMarketFills,
    getNotifications,
    getThemeName,
    getWallet,
} from './selectors';

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
            const userAccount = getEthAccount(state);
            const userFills = fills.filter(f => f.takerAddress === userAccount || f.makerAddress === userAccount);
            localStorage.saveFills(userFills, userAccount);
            /*const markets: { [key: string]: Fill[] } = {};
            fills.forEach(f => {
                if (markets[f.market]) {
                    markets[f.market].push(f);
                } else {
                    markets[f.market] = [f];
                }
            });
            localStorage.saveMarketFills(markets, ethAccount);*/
            /*  Object.keys(markets).forEach(m => {
               localStorage.saveMarketFills(markets[m], ethAccount, m);
               localStorage.saveMarketFills(markets[m].filter(f  => f.takerAddress === userAccount || f.makerAddress === userAccount), userAccount, m);
            });*/

            break;
        }
        case getType(actions.setFills): {
            const state = getState();
            const ethAccount = FEE_RECIPIENT;
            const fills = getFills(state);
            localStorage.saveFills(fills, ethAccount);
            break;
        }
        case getType(actions.setMarketFills): {
            const state = getState();
            const ethAccount = FEE_RECIPIENT;
            const fills = getMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount);
            break;
        }
        case getType(actions.addMarketFills): {
            const state = getState();
            const ethAccount = FEE_RECIPIENT;
            const fills = getMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount);
            break;
        }
        /* case getType(actions.addUserFills): {
            const state = getState();
            const ethAccount = getEthAccount(state);
            const fills = getFills(state);
            localStorage.saveFills(fills, ethAccount);
            break;
        }
        case getType(actions.setUserFills): {
            const state = getState();
            const ethAccount =  getEthAccount(state);
            const fills = getUserFills(state);
            localStorage.saveFills(fills, ethAccount);
            break;
        }
        case getType(actions.addUserMarketFills): {
            const state = getState();
            const ethAccount =  getEthAccount(state);
            const currencyPair =  getCurrencyPair(state);
            const market = marketToString(currencyPair);
            const fills = getUserMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount, market);
            break;
        }
        case getType(actions.setUserMarketFills): {
            const state = getState();
            const ethAccount =  getEthAccount(state);
            const currencyPair =  getCurrencyPair(state);
            const market = marketToString(currencyPair);
            const fills = getUserMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount, market);
            break;
        }
        case getType(actions.setMarketFills): {
            const state = getState();
            const ethAccount =  FEE_RECIPIENT;
            const currencyPair =  getCurrencyPair(state);
            const market = marketToString(currencyPair);
            const fills = getMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount, market);
            break;
        }
        case getType(actions.addMarketFills): {
            const state = getState();
            const ethAccount =  FEE_RECIPIENT;
            const currencyPair =  getCurrencyPair(state);
            const market = marketToString(currencyPair);
            const fills = getMarketFills(state);
            localStorage.saveMarketFills(fills, ethAccount, market);
            break;
        }*/
        case getType(actions.resetWallet): {
            localStorage.resetWalletConnected();
            break;
        }
        case getType(actions.setThemeName): {
            const state = getState();
            const themeName = getThemeName(state);
            localStorage.saveThemeName(themeName);
            break;
        }

        case getType(actions.setWallet): {
            const state = getState();
            const wallet = getWallet(state);
            if (wallet) {
                localStorage.saveWalletConnected(wallet);
            }
            break;
        }

        default:
            return result;
    }
};
