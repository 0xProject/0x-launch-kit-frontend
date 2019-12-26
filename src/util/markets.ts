import { BigNumber } from '0x.js';

import { convertDateToUTCTimestamp } from './time_utils';
import { formatTokenSymbol } from './tokens';
import { CurrencyPair, Fill, Market, Token } from './types';

export const filterMarketsByTokenSymbol = (markets: Market[], tokenSymbol: string): Market[] => {
    return markets.filter(
        market => market.currencyPair.base === tokenSymbol || market.currencyPair.quote === tokenSymbol,
    );
};

export const filterMarketsByString = (markets: Market[], str: string): Market[] => {
    return markets.filter(market => {
        const baseLowerCase = market.currencyPair.base.toLowerCase();
        const quoteLowerCase = market.currencyPair.quote.toLowerCase();
        return `${baseLowerCase}/${quoteLowerCase}`.indexOf(str.toLowerCase()) !== -1;
    });
};
/**
 * Export current market as string
 */
export const marketToString = (currencyPair: CurrencyPair): string => {
    return `${currencyPair.base.toUpperCase()}-${currencyPair.quote.toUpperCase()}`;
};

/**
 * Export current market as string
 */
export const formatMarketToString = (currencyPair: CurrencyPair): string => {
    return `${formatTokenSymbol(currencyPair.base).toUpperCase()}-${formatTokenSymbol(
        currencyPair.quote,
    ).toUpperCase()}`;
};

/**
 * Export current market as string
 */
export const marketToStringFromTokens = (base: Token, quote: Token): string => {
    return `${base.symbol.toUpperCase()}-${quote.symbol.toUpperCase()}`;
};

/**
 * Export current market as string
 */
export const getLastPrice = (fills: Fill[]): string | null => {
    if (fills && fills.length) {
        return fills[0].price;
    } else {
        return null;
    }
};

/**
 * Get Today fills at UTC time
 */
export const getTodayFillsUTC = (fills: Fill[]): Fill[] | null => {
    if (fills && fills.length) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const startOfDayUtc = convertDateToUTCTimestamp(startOfDay);
        return fills.filter(f => convertDateToUTCTimestamp(f.timestamp) > startOfDayUtc);
    } else {
        return null;
    }
};

export const getTodayVolumeFromFills = (fills: Fill[]): BigNumber | null => {
    if (fills && fills.length) {
        const todayFills = getTodayFillsUTC(fills);
        if (todayFills && todayFills.length) {
            return todayFills.map(f => f.amountBase).reduce((p, c) => p.plus(c));
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const getTodayHighPriceFromFills = (fills: Fill[]): number | null | BigNumber => {
    if (fills && fills.length) {
        const todayFills = getTodayFillsUTC(fills);
        if (todayFills && todayFills.length) {
            return new BigNumber(Math.max(...todayFills.map(f => Number(f.price))));
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const getTodayLowerPriceFromFills = (fills: Fill[]): number | null | BigNumber => {
    if (fills && fills.length) {
        const todayFills = getTodayFillsUTC(fills);
        if (todayFills && todayFills.length) {
            return new BigNumber(Math.min(...todayFills.map(f => Number(f.price))));
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const getTodayClosedOrdersFromFills = (fills: Fill[]): number | null => {
    if (fills && fills.length) {
        const todayFills = getTodayFillsUTC(fills);
        if (todayFills && todayFills.length) {
            return todayFills.length;
        } else {
            return null;
        }
    } else {
        return null;
    }
};
