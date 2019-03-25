import { BigNumber } from '0x.js';
enum TokenSymbolRules {
    UpperCase,
    LowerCase,
    Same,
}

const tokenRules = [
    {
        symbol: TokenSymbols.Weth,
        rule: TokenSymbolRules.UpperCase,
    },
    {
        symbol: TokenSymbols.Zrx,
        rule: TokenSymbolRules.Same,
    },
    {
        symbol: TokenSymbols.Mkr,
        rule: TokenSymbolRules.Same,
    },
    {
        symbol: TokenSymbols.Dgd,
        rule: TokenSymbolRules.Same,
    },
    {
        symbol: TokenSymbols.Mln,
        rule: TokenSymbolRules.Same,
    },
    {
        symbol: TokenSymbols.Rep,
        rule: TokenSymbolRules.Same,
    },
];

import { TokenSymbols } from './types';

export const tokenAmountInUnitsToBigNumber = (amount: BigNumber, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken);
};

export const tokenAmountInUnits = (amount: BigNumber, decimals: number, toFixedDecimals = 2): string => {
    return tokenAmountInUnitsToBigNumber(amount, decimals).toFixed(toFixedDecimals);
};

export const unitsInTokenAmount = (units: string, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);

    return new BigNumber(units).mul(decimalsPerToken);
};

export const tokenSymbolWithDisplayRules = (symbol: string): string => {
    let symbolReturn = symbol.toString();

    for (const tokenRule of tokenRules) {
        switch (tokenRule.rule) {
            case TokenSymbolRules.LowerCase: {
                symbolReturn = symbolReturn.toLowerCase();
                break;
            }
            case TokenSymbolRules.UpperCase: {
                symbolReturn = symbolReturn.toUpperCase();
                break;
            }
        }
    }
    return symbolReturn;
};
