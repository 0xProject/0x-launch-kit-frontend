import { getAvailableMarkets } from '../common/markets';

import { getKnownTokens } from './known_tokens';
import { CurrencyPair, Token } from './types';

export const getCurrencyPairByTokensSymbol = (base: string, quote: string): CurrencyPair => {
    const currencyPair = getAvailableMarkets().find(
        m => m.base === base.toLowerCase() && m.quote === quote.toLowerCase(),
    );
    if (!currencyPair) {
        throw new Error(`Currency pair with base token ${base} and quote token ${quote} not found in known markets`);
    }
    return currencyPair;
};

export const getCurrencyPairFromTokens = (base: Token, quote: Token): CurrencyPair => {
    const currencyPair = getAvailableMarkets().find(
        m => m.base === base.symbol.toLowerCase() && m.quote === quote.symbol.toLowerCase(),
    );
    if (!currencyPair) {
        throw new Error(`Currency pair with base token ${base} and quote token ${quote} not found in known markets`);
    }
    return currencyPair;
};

export const getTokensFromCurrencyPair = (currencyPair: CurrencyPair): Token[] => {
    const knownToken = getKnownTokens();
    const baseToken = knownToken.getTokenBySymbol(currencyPair.base);
    const quoteToken = knownToken.getTokenBySymbol(currencyPair.quote);
    return [baseToken, quoteToken];
};

export const getCurrencyPairByMarket = (market: string): CurrencyPair => {
    const [base, quote] = market.split('-');
    const currencyPair = getAvailableMarkets().find(
        m => m.base === base.toLowerCase() && m.quote === quote.toLowerCase(),
    );
    if (!currencyPair) {
        throw new Error(`Currency pair with base token ${base} and quote token ${quote} not found in known markets`);
    }
    return currencyPair;
};
