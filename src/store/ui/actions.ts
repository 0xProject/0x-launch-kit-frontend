import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction } from 'typesafe-actions';

import { getContractWrappers } from '../../services/contract_wrappers';
import { getWeb3WrapperOrThrow } from '../../services/web3_wrapper';
import { getKnownTokens } from '../../util/known_tokens';
import { buildLimitOrder } from '../../util/orders';
import { Notification, OrderSide, Step, StepKind, Token } from '../../util/types';
import { getEthAccount, getSelectedToken } from '../selectors';

export const setHasUnreadNotifications = createAction('SET_HAS_UNREAD_NOTIFICATIONS', resolve => {
    return (hasUnreadNotifications: boolean) => resolve(hasUnreadNotifications);
});

export const addNotification = createAction('ADD_NOTIFICATION', resolve => {
    return (newNotification: Notification) => resolve(newNotification);
});

export const setStepsModalPendingSteps = createAction('SET_STEPSMODAL_PENDING_STEPS', resolve => {
    return (pendingSteps: Step[]) => resolve(pendingSteps);
});

export const setStepsModalDoneSteps = createAction('SET_STEPSMODAL_DONE_STEPS', resolve => {
    return (doneSteps: Step[]) => resolve(doneSteps);
});

export const setStepsModalCurrentStep = createAction('SET_STEPSMODAL_CURRENT_STEP', resolve => {
    return (currentStep: Step | null) => resolve(currentStep);
});

export const stepsModalAdvanceStep = createAction('STEPSMODAL_ADVANCE_STEP');

export const stepsModalReset = createAction('STEPSMODAL_RESET');

export const startBuySellLimitSteps = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any) => {
        const step: Step = {
            kind: StepKind.BuySellLimit,
            amount,
            price,
            side,
        };
        const pendingSteps: Step[] = [];
        dispatch(setStepsModalPendingSteps(pendingSteps));
        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const createSignedOrder = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const selectedToken = getSelectedToken(state) as Token;

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const contractWrappers = await getContractWrappers();
        const wethAddress = getKnownTokens(networkId).getWethToken().address;

        const order = buildLimitOrder(
            {
                account: ethAccount,
                amount,
                price,
                tokenAddress: selectedToken.address,
                wethAddress,
                exchangeAddress: contractWrappers.exchange.address,
            },
            side,
        );

        const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
        return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
    };
};
