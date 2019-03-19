import { getType } from 'typesafe-actions';

import { NotificationKind, OrderFilledNotification, Step, StepsModalState, UIState } from '../../util/types';
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
        case getType(actions.setNotifications):
            return { ...state, notifications: action.payload };
        case getType(actions.addNotification): {
            let doesAlreadyExist = false;
            if (action.payload.kind === NotificationKind.OrderFilled) {
                const newNotification = action.payload as OrderFilledNotification;

                doesAlreadyExist = state.notifications
                    .filter(notification => notification.kind === NotificationKind.OrderFilled)
                    .map(notification => notification as OrderFilledNotification)
                    .some(notification => notification.txHash === newNotification.txHash);
            }

            if (doesAlreadyExist) {
                return state;
            } else {
                return {
                    ...state,
                    notifications: [action.payload, ...state.notifications],
                    hasUnreadNotifications: true,
                };
            }
        }
    }

    return {
        ...state,
        stepsModal: stepsModal(state.stepsModal, action),
    };
}
