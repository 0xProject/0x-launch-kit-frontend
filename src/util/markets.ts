import { Market } from './types';

export const filterMarketsByString = (markets: Market[], str: string): Market[] => {
    return markets.filter(market => {
        const baseLowerCase = market.currencyPair.base.toLowerCase();
        const quoteLowerCase = market.currencyPair.quote.toLowerCase();
        return `${baseLowerCase}/${quoteLowerCase}`.indexOf(str.toLowerCase()) !== -1;
    });
};
