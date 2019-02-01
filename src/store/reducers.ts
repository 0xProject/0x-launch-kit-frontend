import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { BlockchainState, RelayerState, StoreState, Web3State } from '../util/types';

import * as actions from './actions';

export type RootAction = ActionType<typeof actions>;

const initialBlockchainState: BlockchainState = {
    ethAccount: '',
    web3State: Web3State.Loading,
    knownTokens: [],
    wethBalance: new BigNumber(0),
};

const initialRelayerState: RelayerState = {
    orders: [],
    selectedToken: null,
};

export function blockchain(state: BlockchainState = initialBlockchainState, action: RootAction): BlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setKnownTokens):
            return { ...state, knownTokens: action.payload };
        case getType(actions.setWethBalance):
            return { ...state, wethBalance: action.payload };
    }
    return state;
}

export function relayer(state: RelayerState = initialRelayerState, action: RootAction): RelayerState {
    switch (action.type) {
        case getType(actions.setOrders):
            return { ...state, orders: action.payload };
        case getType(actions.setSelectedToken):
            return { ...state, selectedToken: action.payload };
    }
    return state;
}

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        blockchain,
        relayer,
    });
