import { BigNumber } from '0x.js';

import { isWeth } from './known_tokens';
import { TokenSymbol } from './types';

export const tokenAmountInUnitsToBigNumber = (amount: BigNumber, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken);
};

export const tokenAmountInUnits = (amount: BigNumber, decimals: number, toFixedDecimals = 2): string => {
    return tokenAmountInUnitsToBigNumber(amount, decimals).toFixed(toFixedDecimals);
};

export const unitsInTokenAmount = (units: string, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);

    return new BigNumber(units).multipliedBy(decimalsPerToken);
};

export const tokenSymbolToDisplayString = (symbol: TokenSymbol): string => {
    return isWeth(symbol) ? 'wETH' : symbol.toString().toUpperCase();
};
