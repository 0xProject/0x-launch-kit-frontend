import { BigNumber } from '0x.js';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import {
    BlockchainState,
    FetchPriceZRXState,
    RelayerState,
    Step,
    StepsModalState,
    StoreState,
    UIState,
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

const initialStepsModalState: StepsModalState = {
    doneSteps: [],
    currentStep: null,
    pendingSteps: [],
};

const initialUIState: UIState = {
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
    return {
        ...state,
        stepsModal: stepsModal(state.stepsModal, action),
    };
}

const initialFetchPriceZRXState = {
    price: new BigNumber(0),
    error: null,
    isFetching: false,
    lastFetched: 0,
};

export const fetchPriceZRX = (
    state: FetchPriceZRXState = initialFetchPriceZRXState,
    action: RootAction,
): FetchPriceZRXState => {
    switch (action.type) {
        case getType(actions.fetchPriceZRXError): {
            return {
                ...state,
                isFetching: false,
            };
        }

        case getType(actions.fetchPriceZRXStart): {
            return {
                ...state,
                isFetching: true,
            };
        }

        case getType(actions.fetchPriceZRXUpdate): {
            return {
                ...state,
                price: (action.payload && action.payload.price) || new BigNumber(0),
                error: null,
                isFetching: false,
                lastFetched: Date.now(),
            };
        }

        default: {
            return state;
        }
    }
};

export const createRootReducer = (history: History) =>
    combineReducers<StoreState>({
        router: connectRouter(history),
        blockchain,
        relayer,
        ui,
        fetchPriceZRX,
    });
