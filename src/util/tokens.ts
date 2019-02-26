import { BigNumber } from '0x.js';

export const tokenAmountInUnits = (amount: BigNumber, decimals: number): string => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken).toFixed(2);
};

export const unitsInTokenAmount = (units: string, decimals: number): BigNumber => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);

    return new BigNumber(units).mul(decimalsPerToken);
};
