import { CurrencyPair, TokenSymbol } from '../util/types';

export const availableMarkets: CurrencyPair[] = [
    {
        base: TokenSymbol.Vsf,
        quote: TokenSymbol.Weth,
    },
    {
        base: TokenSymbol.Zrx,
        quote: TokenSymbol.Weth,
    },
    {
        base: TokenSymbol.Mkr,
        quote: TokenSymbol.Weth,
    },
    {
        base: TokenSymbol.Zrx,
        quote: TokenSymbol.Vsf,
    },
];
