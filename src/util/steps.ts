import { OrderSide, Step, StepKind } from './types';

export const getStepTitle = (step: Step): string => {
    switch (step.kind) {
        case StepKind.SellCollectible:
        case StepKind.BuySellLimit:
            return 'Sign';
        case StepKind.BuySellMarket:
            return step.side === OrderSide.Buy ? 'Buy' : 'Sell';
        case StepKind.ToggleTokenLock:
        case StepKind.UnlockCollectibles:
            return step.isUnlocked ? 'Lock' : 'Unlock';
        case StepKind.WrapEth:
            return 'Convert';
        case StepKind.BuyCollectible:
            return 'Buy';
        default:
            const _exhaustiveCheck: never = step;
            return _exhaustiveCheck;
    }
};

export const isLongStep = (step: Step): boolean => {
    switch (step.kind) {
        case StepKind.SellCollectible:
        case StepKind.BuySellLimit:
            return false;
        case StepKind.BuySellMarket:
        case StepKind.ToggleTokenLock:
        case StepKind.UnlockCollectibles:
        case StepKind.WrapEth:
        case StepKind.BuyCollectible:
            return true;
        default:
            const _exhaustiveCheck: never = step;
            return _exhaustiveCheck;
    }
};

export const makeGetProgress = (beginning: number, estimatedTxTimeMs: number) => (now: number) => {
    const elapsedMs = now - beginning;

    const progress = Math.round((elapsedMs / estimatedTxTimeMs) * 100);

    return Math.max(0, Math.min(progress, 95));
};
