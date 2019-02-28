import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { BlockchainState, RelayerState, Step, StepsModalState, StoreState, Web3State } from '../util/types';

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

const initialStepsModal: StepsModalState = {
    isVisible: false,
    doneSteps: [],
    currentStep: null,
    pendingSteps: [],
    transactionPromise: null,
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

export function stepsModal(state: StepsModalState = initialStepsModal, action: RootAction): StepsModalState {
    switch (action.type) {
        case getType(actions.setStepsModalVisibility):
            return { ...state, isVisible: action.payload };
        case getType(actions.setStepsModalDoneSteps):
            return { ...state, doneSteps: action.payload };
        case getType(actions.setStepsModalPendingSteps):
            return { ...state, pendingSteps: action.payload };
        case getType(actions.setStepsModalCurrentStep):
            return { ...state, currentStep: action.payload };
        case getType(actions.setStepsModalTransactionPromise):
            return { ...state, transactionPromise: action.payload };
        case getType(actions.stepsModalAdvanceStep):
            const { doneSteps, currentStep, pendingSteps } = state;
            if (pendingSteps.length === 0 && currentStep !== null) {
                return {
                    ...state,
                    doneSteps: doneSteps.concat([currentStep as Step]),
                    currentStep: null,
                };
            } else if (pendingSteps.length > 1) {
                return {
                    ...state,
                    pendingSteps: pendingSteps.slice(1, pendingSteps.length),
                    doneSteps: doneSteps.concat([currentStep as Step]),
                    currentStep: pendingSteps[0] as Step,
                };
            } else {
                return {
                    ...state,
                    pendingSteps: [],
                    currentStep: pendingSteps.pop() as Step,
                    doneSteps: doneSteps.concat([currentStep as Step]),
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
        stepsModal,
    });
