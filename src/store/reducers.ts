import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { BlockchainState, RelayerState, Step, StepsModalState, StoreState, UIState, Web3State } from '../util/types';

import * as actions from './actions';

export type RootAction = ActionType<typeof actions>;

const initialBlockchainState: BlockchainState = {
    ethAccount: '',
    web3State: Web3State.Loading,
    tokenBalances: [],
    ethBalance: new BigNumber(0),
    wethTokenBalance: null,
};

const initialRelayerState: RelayerState = {
    orders: [],
    userOrders: [],
    selectedToken: null,
};

const initialStepsModalState: StepsModalState = {
    doneSteps: [],
    currentStep: null,
    pendingSteps: [],
};

const initialUIState: UIState = {
    notifications: [],
    hasUnreadNotifications: false,
    stepsModal: initialStepsModalState,
};

export function blockchain(state: BlockchainState = initialBlockchainState, action: RootAction): BlockchainState {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setTokenBalances):
            return { ...state, tokenBalances: action.payload };
        case getType(actions.setWethTokenBalance):
            return { ...state, wethTokenBalance: action.payload };
        case getType(actions.setWethBalance):
            return {
                ...state,
                wethTokenBalance: state.wethTokenBalance
                    ? {
                          ...state.wethTokenBalance,
                          balance: action.payload,
                      }
                    : null,
            };
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

export function stepsModal(state: StepsModalState = initialStepsModalState, action: RootAction): StepsModalState {
    switch (action.type) {
        case getType(actions.setStepsModalDoneSteps):
            return { ...state, doneSteps: action.payload };
        case getType(actions.setStepsModalPendingSteps):
            return { ...state, pendingSteps: action.payload };
        case getType(actions.setStepsModalCurrentStep):
            return { ...state, currentStep: action.payload };
        case getType(actions.stepsModalAdvanceStep):
            const { doneSteps, currentStep, pendingSteps } = state;
            if (pendingSteps.length === 0 && currentStep !== null) {
                return {
                    ...state,
                    doneSteps: doneSteps.concat([currentStep as Step]),
                    currentStep: null,
                };
            } else {
                return {
                    ...state,
                    pendingSteps: pendingSteps.slice(1),
                    doneSteps: doneSteps.concat([currentStep as Step]),
                    currentStep: pendingSteps[0] as Step,
                };
            }
        case getType(actions.stepsModalReset):
            return initialStepsModalState;
    }
    return state;
}

export function ui(state: UIState = initialUIState, action: RootAction): UIState {
    switch (action.type) {
        case getType(actions.setHasUnreadNotifications):
            return { ...state, hasUnreadNotifications: action.payload };
        case getType(actions.addNotification):
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                hasUnreadNotifications: true,
            };
    }

    return {
        ...state,
        stepsModal: stepsModal(state.stepsModal, action),
    };
}

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        blockchain,
        relayer,
        ui,
    });
