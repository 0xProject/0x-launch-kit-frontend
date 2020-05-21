import { getType } from 'typesafe-actions';

import { RelayerState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialRelayerState: RelayerState = {
    orders: [],
    userOrders: [],
};

export function relayer(state: RelayerState = initialRelayerState, action: RootAction): RelayerState {
    switch (action.type) {
        case getType(actions.setOrders):
            return { ...state, orders: action.payload };
        case getType(actions.setUserOrders):
            return { ...state, userOrders: action.payload };
        case getType(actions.initializeRelayerData):
            return action.payload;
        default:
            return state;
    }
}
