import { availableMarkets } from '../common/markets';

import { CurrencyPair } from './types';

export const getCurrencyPairByTokensSymbol = (base: string, quote: string): CurrencyPair => {
    const currencyPair = availableMarkets.find(m => m.base === base.toLowerCase() && m.quote === quote.toLowerCase());
    if (!currencyPair) {
        throw new Error(`Currency pair with base token ${base} and quote token ${quote} not found in known markets`);
    }
    return currencyPair;
};
