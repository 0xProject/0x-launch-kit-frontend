import { CurrencyPair, TokenSymbol } from '../util/types';

export const availableMarkets: CurrencyPair[] = [
    {
      base: TokenSymbol.Usdc,
      quote: TokenSymbol.Pax,
    },
    {
      base: TokenSymbol.Usds,
      quote: TokenSymbol.Pax,
    },
    {
        base: TokenSymbol.Weth,
        quote: TokenSymbol.Pax,
    },
    {
        base: TokenSymbol.Pax,
        quote: TokenSymbol.Tusd,
    },
    {
      base: TokenSymbol.Usdc,
      quote: TokenSymbol.Tusd,
    },
    {
      base: TokenSymbol.Usds,
      quote: TokenSymbol.Tusd,
    },
    {
        base: TokenSymbol.Weth,
        quote: TokenSymbol.Tusd,
    },
    {
        base: TokenSymbol.Usds,
        quote: TokenSymbol.Usdc,
    },
    {
        base: TokenSymbol.Weth,
        quote: TokenSymbol.Usdc,
    },
    {
        base: TokenSymbol.Weth,
        quote: TokenSymbol.Usds,
    },
    {
        base: TokenSymbol.Pax,
        quote: TokenSymbol.Usdt,
    },
    {
        base: TokenSymbol.Tusd,
        quote: TokenSymbol.Usdt,
    },
    {
      base: TokenSymbol.Usdc,
      quote: TokenSymbol.Usdt,
    },
    {
      base: TokenSymbol.Usds,
      quote: TokenSymbol.Usdt,
    },
    {
        base: TokenSymbol.Weth,
        quote: TokenSymbol.Usdt,
    },
    {
        base: TokenSymbol.Zrx,
        quote: TokenSymbol.Usdt,
    },
    {
        base: TokenSymbol.Zrx,
        quote: TokenSymbol.Weth,
    },
];
