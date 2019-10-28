import { getType } from 'typesafe-actions';

import { RelayerState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialRelayerState: RelayerState = {
    orders: [],
    userOrders: [],
    accountMarketStats: [],
};

export function relayer(state: RelayerState = initialRelayerState, action: RootAction): RelayerState {
    switch (action.type) {
        case getType(actions.setOrders):
            return { ...state, orders: action.payload };
        case getType(actions.setAccountMarketStats):
            return { ...state, accountMarketStats: action.payload };
        case getType(actions.setUserOrders):
            return { ...state, userOrders: action.payload };
        case getType(actions.initializeRelayerData):
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
