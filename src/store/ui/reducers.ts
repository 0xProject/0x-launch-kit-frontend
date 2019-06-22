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
    fills: [],
    hasUnreadNotifications: false,
    stepsModal: initialStepsModalState,
    orderPriceSelected: null,
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
        default:
            return state;
    }
}

export function ui(state: UIState = initialUIState, action: RootAction): UIState {
    switch (action.type) {
        case getType(actions.setHasUnreadNotifications):
            return { ...state, hasUnreadNotifications: action.payload };
        case getType(actions.setOrderPriceSelected):
            return { ...state, orderPriceSelected: action.payload };
        case getType(actions.setNotifications):
            return { ...state, notifications: action.payload };
        case getType(actions.addNotifications): {
            const newNotifications = action.payload.filter(notification => {
                const doesAlreadyExist = state.notifications
                    .filter(n => n.kind === notification.kind)
                    .some(n => n.id === notification.id);

                return !doesAlreadyExist;
            });

            if (newNotifications.length) {
                return {
                    ...state,
                    notifications: [...newNotifications, ...state.notifications],
                    hasUnreadNotifications: true,
                };
            } else {
                return state;
            }
        }
        case getType(actions.setFills):
            return { ...state, fills: action.payload };
        case getType(actions.addFills): {
            const newFills = action.payload.filter(fill => {
                const doesAlreadyExist = state.fills
                    .some(f => f.id === fill.id);
                return !doesAlreadyExist;
            });

            if (newFills.length) {
                return {
                    ...state,
                    fills: [...newFills, ...state.fills],
                };
            } else {
                return state;
            }
        }
        default:
            return {
                ...state,
                stepsModal: stepsModal(state.stepsModal, action),
            };
    }
}
