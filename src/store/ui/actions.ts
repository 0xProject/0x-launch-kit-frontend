import { BigNumber, MetamaskSubprovider, signatureUtils } from '0x.js';
import { createAction } from 'typesafe-actions';

import { COLLECTIBLE_CONTRACT_ADDRESSES } from '../../common/constants';
import { InsufficientQuoteTokenException } from '../../exceptions/insufficient_quote_token_exception';
import { SignedOrderException } from '../../exceptions/signed_order_exception';
import { isWeth } from '../../util/known_tokens';
import { buildLimitOrder, buildMarketOrders, isDutchAuction } from '../../util/orders';
import {
    createBasicBuyCollectibleSteps,
    createBuySellLimitSteps,
    createBuySellMarketSteps,
    createDutchBuyCollectibleSteps,
    createSellCollectibleSteps,
} from '../../util/steps_modals_generation';
import {
    Collectible,
    Notification,
    NotificationKind,
    OrderSide,
    Step,
    StepKind,
    StepToggleTokenLock,
    StepWrapEth,
    ThunkCreator,
    Token,
    TokenBalance,
} from '../../util/types';
import * as selectors from '../selectors';

export const setHasUnreadNotifications = createAction('ui/UNREAD_NOTIFICATIONS_set', resolve => {
    return (hasUnreadNotifications: boolean) => resolve(hasUnreadNotifications);
});

export const addNotifications = createAction('ui/NOTIFICATIONS_add', resolve => {
    return (newNotifications: Notification[]) => resolve(newNotifications);
});

export const setNotifications = createAction('ui/NOTIFICATIONS_set', resolve => {
    return (notifications: Notification[]) => resolve(notifications);
});

export const setStepsModalPendingSteps = createAction('ui/steps_modal/PENDING_STEPS_set', resolve => {
    return (pendingSteps: Step[]) => resolve(pendingSteps);
});

export const setStepsModalDoneSteps = createAction('ui/steps_modal/DONE_STEPS_set', resolve => {
    return (doneSteps: Step[]) => resolve(doneSteps);
});

export const setStepsModalCurrentStep = createAction('ui/steps_modal/CURRENT_STEP_set', resolve => {
    return (currentStep: Step | null) => resolve(currentStep);
});

export const stepsModalAdvanceStep = createAction('ui/steps_modal/advance_step');

export const stepsModalReset = createAction('ui/steps_modal/reset');

export const startToggleTokenLockSteps: ThunkCreator = (token: Token, isUnlocked: boolean) => {
    return async dispatch => {
        const toggleTokenLockStep = isUnlocked ? getLockTokenStep(token) : getUnlockTokenStep(token);

        dispatch(setStepsModalCurrentStep(toggleTokenLockStep));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startWrapEtherSteps: ThunkCreator = (newWethBalance: BigNumber) => {
    return async (dispatch, getState) => {
        const state = getState();
        const currentWethBalance = selectors.getWethBalance(state);

        const wrapEthStep: StepWrapEth = {
            kind: StepKind.WrapEth,
            currentWethBalance,
            newWethBalance,
            context: 'standalone',
        };

        dispatch(setStepsModalCurrentStep(wrapEthStep));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startSellCollectibleSteps: ThunkCreator = (
    collectible: Collectible,
    startingPrice: BigNumber,
    side: OrderSide,
    expirationDate: BigNumber,
    endingPrice: BigNumber | null,
) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();

        const contractWrapers = await getContractWrappers();
        const ethAccount = selectors.getEthAccount(state);

        const web3Wrapper = await getWeb3Wrapper();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const collectibleAddress = COLLECTIBLE_CONTRACT_ADDRESSES[networkId];

        const isUnlocked = await contractWrapers.erc721Token.isProxyApprovedForAllAsync(collectibleAddress, ethAccount);
        const sellCollectibleSteps: Step[] = createSellCollectibleSteps(
            collectible,
            startingPrice,
            side,
            isUnlocked,
            expirationDate,
            endingPrice,
        );
        dispatch(setStepsModalCurrentStep(sellCollectibleSteps[0]));
        dispatch(setStepsModalPendingSteps(sellCollectibleSteps.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startBuyCollectibleSteps: ThunkCreator = (collectible: Collectible, ethAccount: string) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        if (!collectible.order) {
            throw new Error('Collectible is not for sale');
        }

        let buyCollectibleSteps;
        if (isDutchAuction(collectible.order)) {
            const state = getState();
            const contractWrappers = await getContractWrappers();

            const wethTokenBalance = selectors.getWethTokenBalance(state) as TokenBalance;

            const { currentAmount } = await contractWrappers.dutchAuction.getAuctionDetailsAsync(collectible.order);

            buyCollectibleSteps = createDutchBuyCollectibleSteps(
                collectible.order,
                collectible,
                wethTokenBalance,
                currentAmount,
            );
        } else {
            buyCollectibleSteps = createBasicBuyCollectibleSteps(collectible.order, collectible);
        }

        dispatch(setStepsModalCurrentStep(buyCollectibleSteps[0]));
        dispatch(setStepsModalPendingSteps(buyCollectibleSteps.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startBuySellLimitSteps: ThunkCreator = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = selectors.getBaseToken(state) as Token;
        const quoteToken = selectors.getQuoteToken(state) as Token;
        const tokenBalances = selectors.getTokenBalances(state) as TokenBalance[];
        const wethTokenBalance = selectors.getWethTokenBalance(state) as TokenBalance;

        const buySellLimitFlow: Step[] = createBuySellLimitSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            price,
            side,
        );

        dispatch(setStepsModalCurrentStep(buySellLimitFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellLimitFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startBuySellMarketSteps: ThunkCreator = (amount: BigNumber, side: OrderSide) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseToken = selectors.getBaseToken(state) as Token;
        const quoteToken = selectors.getQuoteToken(state) as Token;
        const tokenBalances = selectors.getTokenBalances(state) as TokenBalance[];
        const wethTokenBalance = selectors.getWethTokenBalance(state) as TokenBalance;
        const totalEthBalance = selectors.getTotalEthBalance(state);
        const quoteTokenBalance = selectors.getQuoteTokenBalance(state);

        const orders = side === OrderSide.Buy ? selectors.getOpenSellOrders(state) : selectors.getOpenBuyOrders(state);
        const [, filledAmounts, canBeFilled] = buildMarketOrders(
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

        const totalFilledAmount = filledAmounts.reduce((total: BigNumber, currentValue: BigNumber) => {
            return total.plus(currentValue);
        }, new BigNumber(0));

        const price = totalFilledAmount.div(amount);

        // Before creating market steps, checks if the total amount of ETH (wETH + ETH) or the quoteToken balance is enough, otherwise throws an exception
        if (quoteTokenBalance && quoteTokenBalance.balance.isLessThan(price)) {
            // Before throwing an exception, we check if the quoteToken is wETH, in that case we could have more ETH To wrap.
            if (isWeth(quoteToken.symbol) && totalEthBalance.isGreaterThan(price)) {
                return;
            }
            throw new InsufficientQuoteTokenException(quoteToken.symbol);
        }

        const buySellMarketFlow: Step[] = createBuySellMarketSteps(
            baseToken,
            quoteToken,
            tokenBalances,
            wethTokenBalance,
            amount,
            side,
            price,
        );

        dispatch(setStepsModalCurrentStep(buySellMarketFlow[0]));
        dispatch(setStepsModalPendingSteps(buySellMarketFlow.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

const getUnlockTokenStep = (token: Token): StepToggleTokenLock => {
    return {
        kind: StepKind.ToggleTokenLock,
        token,
        isUnlocked: false,
        context: 'standalone',
    };
};

const getLockTokenStep = (token: Token): StepToggleTokenLock => {
    return {
        kind: StepKind.ToggleTokenLock,
        token,
        isUnlocked: true,
        context: 'standalone',
    };
};

export const createSignedOrder: ThunkCreator = (amount: BigNumber, price: BigNumber, side: OrderSide) => {
    return async (dispatch, getState, { getContractWrappers, getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = selectors.getEthAccount(state);
        const baseToken = selectors.getBaseToken(state) as Token;
        const quoteToken = selectors.getQuoteToken(state) as Token;
        try {
            const web3Wrapper = await getWeb3Wrapper();
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
        } catch (error) {
            throw new SignedOrderException(error.message);
        }
    };
};

export const addMarketBuySellNotification: ThunkCreator = (
    id: string,
    amount: BigNumber,
    token: Token,
    side: OrderSide,
    tx: Promise<any>,
) => {
    return async dispatch => {
        dispatch(
            addNotifications([
                {
                    id,
                    kind: NotificationKind.Market,
                    amount,
                    token,
                    side,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );
    };
};
