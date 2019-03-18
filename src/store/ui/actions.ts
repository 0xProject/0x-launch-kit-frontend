import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction } from 'typesafe-actions';

import { ZRX_TOKEN_SYMBOL } from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { getWeb3WrapperOrThrow } from '../../services/web3_wrapper';
import { getKnownTokens } from '../../util/known_tokens';
import { buildLimitOrder, buildMarketOrders } from '../../util/orders';
import {
    Notification,
    NotificationKind,
    OrderSide,
    Step,
    StepKind,
    StepUnlockToken,
    StepWrapEth,
    StoreState,
    Token,
    TokenBalance,
} from '../../util/types';
import {
    getEthAccount,
    getOpenBuyOrders,
    getOpenSellOrders,
    getBaseToken,
    getQuoteToken,
    getTokenBalances,
    getWethBalance,
    getWethTokenBalance,
} from '../selectors';

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
    return async (dispatch: any, getState: any) => {
        const state = getState();

        const buySellLimitFlow: Step[] = [];

        const wrapEthStep = getWrapEthStepIfNeeded(amount, price, side, state);
        if (wrapEthStep) {
            buySellLimitFlow.push(wrapEthStep);
        }
        const unlockZrxStep = getUnlockZrxStepIfNeeded(state);
        if (unlockZrxStep) {
            buySellLimitFlow.push(unlockZrxStep);
        }
        const unlockSelectedTokenStep = getUnlockSelectedTokenStepIfNeeded(side, state);
        if (unlockSelectedTokenStep) {
            buySellLimitFlow.push(unlockSelectedTokenStep);
        }

        buySellLimitFlow.push({
            kind: StepKind.BuySellLimit,
            amount,
            price,
            side,
        });

        dispatch(setStepsModalCurrentStep(buySellLimitFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellLimitFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startBuySellMarketSteps = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();

        const orders = side === OrderSide.Buy ? getOpenSellOrders(state) : getOpenBuyOrders(state);
        const [, , canBeFilled] = buildMarketOrders(
            {
                amount,
                orders,
            },
            side,
        );
        if (!canBeFilled) {
            window.alert('There are no enough orders to fill this amount');
            return;
        }

        const buySellMarketFlow: Step[] = [];

        const unlockZrxStep = getUnlockZrxStepIfNeeded(state);
        if (unlockZrxStep) {
            buySellMarketFlow.push(unlockZrxStep);
        }
        const unlockSelectedTokenStep = getUnlockSelectedTokenStepIfNeeded(side, state);
        if (unlockSelectedTokenStep) {
            buySellMarketFlow.push(unlockSelectedTokenStep);
        }

        const baseToken = getBaseToken(state) as Token;
        buySellMarketFlow.push({
            kind: StepKind.BuySellMarket,
            amount,
            side,
            token: baseToken,
        });

        dispatch(setStepsModalCurrentStep(buySellMarketFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellMarketFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

const getWrapEthStepIfNeeded = (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
    state: StoreState,
): StepWrapEth | null => {
    // Weth needed only when creating a buy order
    if (side === OrderSide.Sell) {
        return null;
    }

    const wethAmount = amount.mul(price);
    const wethBalance = getWethBalance(state);
    const deltaWeth = wethBalance.sub(wethAmount);
    // Need to wrap eth only if weth balance is not enough
    if (deltaWeth.lessThan(0)) {
        return {
            kind: StepKind.WrapEth,
            amount: deltaWeth.abs(),
        };
    } else {
        return null;
    }
};

const getUnlockZrxStepIfNeeded = (state: StoreState): StepUnlockToken | null => {
    const tokenBalances = getTokenBalances(state);
    const zrxTokenBalance: TokenBalance = tokenBalances.find(
        tokenBalance => tokenBalance.token.symbol === ZRX_TOKEN_SYMBOL,
    ) as TokenBalance;
    if (zrxTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.UnlockToken,
            token: zrxTokenBalance.token,
        };
    }
};

const getUnlockSelectedTokenStepIfNeeded = (side: OrderSide, state: StoreState): StepUnlockToken | null => {
    const tokenBalances = getTokenBalances(state);
    let baseTokenBalance: TokenBalance;
    if (side === OrderSide.Sell) {
        const baseToken = getBaseToken(state) as Token;
        baseTokenBalance = tokenBalances.find(
            tokenBalance => tokenBalance.token.symbol === baseToken.symbol,
        ) as TokenBalance;
    } else {
        baseTokenBalance = getWethTokenBalance(state) as TokenBalance;
    }

    if (baseTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.UnlockToken,
            token: baseTokenBalance.token,
        };
    }
};

export const createSignedOrder = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const baseToken = getBaseToken(state) as Token;
        const quoteToken = getQuoteToken(state) as Token;

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const contractWrappers = await getContractWrappers();

        const order = buildLimitOrder(
            {
                account: ethAccount,
                amount,
                price,
                baseTokenAddress: baseToken.address,
                quoteTokenAddress: quoteToken.address,
                exchangeAddress: contractWrappers.exchange.address,
            },
            side,
        );

        const provider = new MetamaskSubprovider(web3Wrapper.getProvider());
        return signatureUtils.ecSignOrderAsync(provider, order, ethAccount);
    };
};

export const addMarketBuySellNotification = (amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) => {
    return async (dispatch: any) => {
        dispatch(
            addNotification({
                kind: NotificationKind.Market,
                amount,
                token,
                side,
                tx,
                timestamp: new Date(),
            }),
        );
    };
};
