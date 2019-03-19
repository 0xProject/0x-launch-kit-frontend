import { getType } from 'typesafe-actions';

import { Step, StepsModalState, UIState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

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
            // This first condition may happen in async scenarios
            if (currentStep === null && pendingSteps.length === 0) {
                return state;
            } else if (pendingSteps.length === 0 && currentStep !== null) {
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
