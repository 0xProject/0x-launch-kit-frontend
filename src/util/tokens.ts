import { BigNumber } from '@0x/utils';

import { isWeth } from './known_tokens';

export const tokenAmountInUnitsToBigNumber = (amount: BigNumber, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken);
};

export const tokenAmountInUnits = (amount: BigNumber, decimals: number, toFixedDecimals = 2): string => {
    const inUnits = tokenAmountInUnitsToBigNumber(amount, decimals);
    if (inUnits.lt(0.0001)) {
        return '< 0.0001';
    }
    const fixedWithTrailingZeroesRemoved = inUnits.toFixed(4).replace(/0+$/, '');
    const formatted = fixedWithTrailingZeroesRemoved.endsWith('.')
        ? fixedWithTrailingZeroesRemoved.replace('.', '')
        : fixedWithTrailingZeroesRemoved;
    return formatted;
};

export const unitsInTokenAmount = (units: string, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);

    return new BigNumber(units).multipliedBy(decimalsPerToken);
};

export const tokenSymbolToDisplayString = (symbol: string): string => {
    return isWeth(symbol) ? 'wETH' : symbol.toUpperCase();
};
