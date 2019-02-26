import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import {
    BlockchainState,
    RelayerState,
    StoreState,
    TransactionStep,
    TransactionStepsModalState,
    Web3State,
} from '../util/types';

import * as actions from './actions';

export type RootAction = ActionType<typeof actions>;

const initialBlockchainState: BlockchainState = {
    ethAccount: '',
    web3State: Web3State.Loading,
    tokenBalances: [],
    ethBalance: new BigNumber(0),
    wethBalance: new BigNumber(0),
};

const initialRelayerState: RelayerState = {
    orders: [],
    userOrders: [],
    selectedToken: null,
};

const initialTransactionStepsModal: TransactionStepsModalState = {
    isVisible: false,
    doneSteps: [],
    currentStep: null,
    pendingSteps: [],
};

export function blockchain(state: BlockchainState = initialBlockchainState, action: RootAction): BlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setTokenBalances):
            return { ...state, tokenBalances: action.payload };
        case getType(actions.setWethBalance):
            return { ...state, wethBalance: action.payload };
        case getType(actions.setEthBalance):
            return { ...state, ethBalance: action.payload };
        case getType(actions.initializeBlockchainData):
            return action.payload;
    }
    return state;
}

export function relayer(state: RelayerState = initialRelayerState, action: RootAction): RelayerState {
    switch (action.type) {
        case getType(actions.setOrders):
            return { ...state, orders: action.payload };
        case getType(actions.setUserOrders):
            return { ...state, userOrders: action.payload };
        case getType(actions.setSelectedToken):
            return { ...state, selectedToken: action.payload };
        case getType(actions.initializeRelayerData):
            return action.payload;
    }
    return state;
}

export function transactionStepsModal(
    state: TransactionStepsModalState = initialTransactionStepsModal,
    action: RootAction,
): TransactionStepsModalState {
    switch (action.type) {
        case getType(actions.setTransactionStepsModalVisibility):
            return { ...state, isVisible: action.payload };
        case getType(actions.setTransactionStepsModalDoneSteps):
            return { ...state, doneSteps: action.payload };
        case getType(actions.setTransactionStepsModalPendingSteps):
            return { ...state, pendingSteps: action.payload };
        case getType(actions.setTransactionStepsModalCurrentStep):
            return { ...state, currentStep: action.payload };
        case getType(actions.transactionStepsModalAdvanceStep):
            const { doneSteps, currentStep, pendingSteps } = state;
            if (pendingSteps.length === 0 && currentStep !== null) {
                return {
                    ...state,
                    doneSteps: doneSteps.concat([currentStep as TransactionStep]),
                    currentStep: null,
                };
            } else if (pendingSteps.length > 1) {
                return {
                    ...state,
                    pendingSteps: pendingSteps.slice(0, pendingSteps.length - 1),
                    doneSteps: doneSteps.concat([currentStep as TransactionStep]),
                    currentStep: pendingSteps.pop() as TransactionStep,
                };
            } else {
                return {
                    ...state,
                    pendingSteps: [],
                    currentStep: null,
                    doneSteps: doneSteps.concat([currentStep as TransactionStep]),
                };
            }
    }
    return state;
}

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        blockchain,
        relayer,
        transactionStepsModal,
    });
