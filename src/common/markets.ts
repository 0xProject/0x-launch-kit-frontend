import { CurrencyPair, TokenSymbols } from '../util/types';

export const availableMarkets: CurrencyPair[] = [
    {
        base: TokenSymbols.Zrx,
        quote: TokenSymbols.Weth,
    },
    {
        base: TokenSymbols.Mkr,
        quote: TokenSymbols.Weth,
    },
    {
        base: TokenSymbols.Zrx,
        quote: TokenSymbols.Mkr,
    },
];
