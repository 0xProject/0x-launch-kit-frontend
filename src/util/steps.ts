import { OrderSide, Step, StepKind } from './types';

export const getStepTitle = (step: Step): string => {
    switch (step.kind) {
        case StepKind.BuySellLimit:
            return 'Sign';
        case StepKind.BuySellMarket:
            return step.side === OrderSide.Buy ? 'Buy' : 'Sell';
        case StepKind.ToggleTokenLock:
            return step.isUnlocked ? 'Lock' : 'Unlock';
        case StepKind.WrapEth:
            return 'Convert';
        default:
            const _exhaustiveCheck: never = step;
            return _exhaustiveCheck;
    }
};

export const isLongStep = (step: Step): boolean => {
    switch (step.kind) {
        case StepKind.BuySellLimit:
            return false;
        case StepKind.BuySellMarket:
        case StepKind.ToggleTokenLock:
        case StepKind.WrapEth:
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
