import { BigNumber, SignedOrder } from '0x.js';

import { MAKER_FEE, TAKER_FEE } from '../common/constants';

import { isWeth, isZrx } from './known_tokens';
import {
    Collectible,
    OrderSide,
    Step,
    StepBuyCollectible,
    StepKind,
    StepToggleTokenLock,
    StepUnlockCollectibles,
    StepWrapEth,
    Token,
    TokenBalance,
} from './types';

export const createBuySellLimitSteps = (
    baseToken: Token,
    quoteToken: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
): Step[] => {
    const buySellLimitFlow: Step[] = [];
    let unlockBaseOrQuoteTokenStep;

    // unlock base and quote tokens if necessary

    unlockBaseOrQuoteTokenStep =
        side === OrderSide.Buy
            ? // If it's a buy -> the quote token has to be unlocked
              getUnlockTokenStepIfNeeded(quoteToken, tokenBalances, wethTokenBalance)
            : // If it's a sell -> the base token has to be unlocked
              getUnlockTokenStepIfNeeded(baseToken, tokenBalances, wethTokenBalance);

    if (unlockBaseOrQuoteTokenStep) {
        buySellLimitFlow.push(unlockBaseOrQuoteTokenStep);
    }

    // unlock zrx (for fees) if it's not one of the traded tokens and if the maker fee is positive
    if (!isZrx(baseToken.symbol) && !isZrx(quoteToken.symbol) && MAKER_FEE.isGreaterThan(0)) {
        const unlockZrxStep = getUnlockZrxStepIfNeeded(tokenBalances);
        if (unlockZrxStep) {
            buySellLimitFlow.push(unlockZrxStep);
        }
    }

    // wrap the necessary ether if it is one of the traded tokens
    if (isWeth(baseToken.symbol) || isWeth(quoteToken.symbol)) {
        const wrapEthStep = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);
        if (wrapEthStep) {
            buySellLimitFlow.push(wrapEthStep);
        }
    }

    buySellLimitFlow.push({
        kind: StepKind.BuySellLimit,
        amount,
        price,
        side,
        token: baseToken,
    });

    return buySellLimitFlow;
};

export const createSellCollectibleSteps = (
    collectible: Collectible,
    startPrice: BigNumber,
    side: OrderSide,
    isUnlocked: boolean,
    expirationDate: BigNumber,
    endPrice: BigNumber | null,
): Step[] => {
    const sellCollectibleFlow: Step[] = [];

    // Unlock collectible
    if (!isUnlocked) {
        const unlockCollectibleStep = getUnlockCollectibleStep(collectible);
        sellCollectibleFlow.push(unlockCollectibleStep);
    }

    // Sign order step
    sellCollectibleFlow.push({
        kind: StepKind.SellCollectible,
        collectible,
        startPrice,
        endPrice,
        expirationDate,
        side,
    });

    return sellCollectibleFlow;
};

export const createBasicBuyCollectibleSteps = (order: SignedOrder, collectible: Collectible): Step[] => {
    return [getBuyCollectibleStep(order, collectible)];
};

export const createDutchBuyCollectibleSteps = (
    order: SignedOrder,
    collectible: Collectible,
    wethTokenBalance: TokenBalance,
    priceInWeth: BigNumber,
): Step[] => {
    const steps: Step[] = [];

    // wrap ether
    const wethBalance = wethTokenBalance.balance;
    const deltaWeth = wethBalance.minus(priceInWeth);
    if (deltaWeth.isLessThan(0)) {
        steps.push({
            kind: StepKind.WrapEth,
            currentWethBalance: wethBalance,
            newWethBalance: priceInWeth,
            context: 'order',
        });
    }

    // unlock weth
    if (!wethTokenBalance.isUnlocked) {
        const unlockWethStep: StepToggleTokenLock = {
            kind: StepKind.ToggleTokenLock,
            token: wethTokenBalance.token,
            context: 'order',
            isUnlocked: false,
        };
        steps.push(unlockWethStep);
    }

    // buy collectible
    steps.push(getBuyCollectibleStep(order, collectible));

    return steps;
};

export const createBuySellMarketSteps = (
    baseToken: Token,
    quoteToken: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
    amount: BigNumber,
    side: OrderSide,
    price: BigNumber,
): Step[] => {
    const buySellMarketFlow: Step[] = [];
    const tokenToUnlock = side === OrderSide.Buy ? quoteToken : baseToken;
    const unlockTokenStep = getUnlockTokenStepIfNeeded(tokenToUnlock, tokenBalances, wethTokenBalance);
    if (unlockTokenStep) {
        buySellMarketFlow.push(unlockTokenStep);
    }

    // unlock zrx (for fees) if the taker fee is positive
    if (!isZrx(tokenToUnlock.symbol) && TAKER_FEE.isGreaterThan(0)) {
        const unlockZrxStep = getUnlockZrxStepIfNeeded(tokenBalances);
        if (unlockZrxStep) {
            buySellMarketFlow.push(unlockZrxStep);
        }
    }

    // wrap the necessary ether if necessary
    if (isWeth(quoteToken.symbol) && wethTokenBalance.balance.isLessThan(amount)) {
        const wrapEthStep = getWrapEthStepIfNeeded(amount, price, side, wethTokenBalance);
        if (wrapEthStep) {
            buySellMarketFlow.push(wrapEthStep);
        }
    }

    buySellMarketFlow.push({
        kind: StepKind.BuySellMarket,
        amount,
        side,
        token: baseToken,
    });
    return buySellMarketFlow;
};

export const getUnlockTokenStepIfNeeded = (
    token: Token,
    tokenBalances: TokenBalance[],
    wethTokenBalance: TokenBalance,
): StepToggleTokenLock | null => {
    const tokenBalance: TokenBalance = isWeth(token.symbol)
        ? wethTokenBalance
        : (tokenBalances.find(tb => tb.token.symbol === token.symbol) as TokenBalance);
    if (tokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.ToggleTokenLock,
            token: tokenBalance.token,
            isUnlocked: false,
            context: 'order',
        };
    }
};

export const getUnlockCollectibleStep = (collectible: Collectible): StepUnlockCollectibles => {
    return {
        kind: StepKind.UnlockCollectibles,
        collectible,
        isUnlocked: false,
    };
};

export const getBuyCollectibleStep = (order: SignedOrder, collectible: Collectible): StepBuyCollectible => {
    return {
        kind: StepKind.BuyCollectible,
        order,
        collectible,
    };
};

export const getWrapEthStepIfNeeded = (
    amount: BigNumber,
    price: BigNumber,
    side: OrderSide,
    wethTokenBalance: TokenBalance,
): StepWrapEth | null => {
    // Weth needed only when creating a buy order
    if (side === OrderSide.Sell) {
        return null;
    }

    const wethAmount = amount.multipliedBy(price);
    const wethBalance = wethTokenBalance.balance;
    const deltaWeth = wethBalance.minus(wethAmount);
    // Need to wrap eth only if weth balance is not enough
    if (deltaWeth.isLessThan(0)) {
        return {
            kind: StepKind.WrapEth,
            currentWethBalance: wethBalance,
            newWethBalance: wethAmount,
            context: 'order',
        };
    } else {
        return null;
    }
};

export const getUnlockZrxStepIfNeeded = (tokenBalances: TokenBalance[]): StepToggleTokenLock | null => {
    const zrxTokenBalance: TokenBalance = tokenBalances.find(tokenBalance =>
        isZrx(tokenBalance.token.symbol),
    ) as TokenBalance;
    if (zrxTokenBalance.isUnlocked) {
        return null;
    } else {
        return {
            kind: StepKind.ToggleTokenLock,
            token: zrxTokenBalance.token,
            isUnlocked: false,
            context: 'order',
        };
    }
};
