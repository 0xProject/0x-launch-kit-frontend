import { getType } from 'typesafe-actions';

import { Config } from '../../common/config';
import { ERC20_THEME_NAME } from '../../common/constants';
import { getThemeByName } from '../../themes/theme_meta_data_utils';
import { MarketFill, Step, StepsModalState, UIState } from '../../util/types';
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
    marketFills: {},
    userFills: [],
    userMarketFills: {},
    hasUnreadNotifications: false,
    stepsModal: initialStepsModalState,
    orderPriceSelected: null,
    sidebarOpen: false,
    openFiatOnRampModal: false,
    themeName: ERC20_THEME_NAME,
    erc20Theme: getThemeByName(ERC20_THEME_NAME),
    generalConfig: Config.getConfig().general,
    configData: null,
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
        case getType(actions.setConfigData):
            return { ...state, configData: action.payload };
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
        case getType(actions.setERC20Theme):
            return { ...state, erc20Theme: action.payload };
        case getType(actions.setThemeName):
            return { ...state, themeName: action.payload };
        case getType(actions.setGeneralConfig):
            return { ...state, generalConfig: action.payload };
        case getType(actions.setFills):
            return { ...state, fills: action.payload };
        case getType(actions.setMarketFills):
            return { ...state, marketFills: action.payload };
        case getType(actions.setUserMarketFills):
            return { ...state, userMarketFills: action.payload };
        case getType(actions.setUserFills):
            return { ...state, userFills: action.payload };
        case getType(actions.addFills): {
            const newFills = action.payload.filter(fill => {
                const doesAlreadyExist = state.fills.some(f => f.id === fill.id);
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
        case getType(actions.addUserFills): {
            const newFills = action.payload.filter(fill => {
                const doesAlreadyExist = state.userFills.some(f => f.id === fill.id);
                return !doesAlreadyExist;
            });
            if (newFills.length) {
                return {
                    ...state,
                    userFills: [...newFills, ...state.userFills],
                };
            } else {
                return state;
            }
        }
        case getType(actions.addMarketFills): {
            const marketFills = state.marketFills;
            const mf: MarketFill = {};

            Object.keys({ ...(action.payload || {}), ...marketFills }).forEach(m => {
                if (action.payload && Object.keys(action.payload).length > 0 && Array.isArray(action.payload[m])) {
                    if (marketFills[m] && marketFills[m].length) {
                        const newFills = action.payload[m].filter(fill => {
                            const doesAlreadyExist = marketFills[m].some(f => f.id === fill.id);
                            return !doesAlreadyExist;
                        });
                        newFills.length ? (mf[m] = [...newFills, ...marketFills[m]]) : (mf[m] = [...marketFills[m]]);
                    } else {
                        mf[m] = action.payload[m];
                    }
                } else {
                    if (marketFills[m] && marketFills[m].length) {
                        mf[m] = [...marketFills[m]];
                    }
                }
            });

            if (action.payload && Object.keys(action.payload).length > 0) {
                return {
                    ...state,
                    marketFills: mf,
                };
            } else {
                return state;
            }
        }
        case getType(actions.openSideBar): {
            return { ...state, sidebarOpen: action.payload };
        }
        case getType(actions.openFiatOnRampModal): {
            return { ...state, openFiatOnRampModal: action.payload };
        }
        /*case getType(actions.addUserMarketFills): {
            const newFills = action.payload.filter(fill => {
                const doesAlreadyExist = state.userMarketFills
                    .some(f => f.id === fill.id);
                return !doesAlreadyExist;
            });
            if (newFills.length) {
                return {
                    ...state,
                    userMarketFills: [...newFills, ...state.userMarketFills],
                };
            } else {
                return state;
            }
        }*/
        default:
            return {
                ...state,
                stepsModal: stepsModal(state.stepsModal, action),
            };
    }
}
