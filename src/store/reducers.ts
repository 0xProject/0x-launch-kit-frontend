import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as actions from './actions';
import { BlockchainState, StoreState, Web3State } from './types';

export type RootAction = ActionType<typeof actions>;

const initialState: BlockchainState = {
    ethAccount: '',
    web3State: Web3State.Loading,
    knownTokens: [],
    wethBalance: new BigNumber(0),
};

export function blockchain(state: BlockchainState = initialState, action: RootAction): BlockchainState {
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

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        blockchain,
    });
