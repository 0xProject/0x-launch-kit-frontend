import { BigNumber } from '0x.js';

export const padRightSplitted = (numBg: BigNumber, decimals: number = 4): { num: string; diff: string } => {
    const numBgToFixed = numBg.toFixed(decimals);
    const numBgToString = numBg.toString();

    const decimalPlaces = (numBgToString.split('.')[1] || []).length;

    let diff = '';
    let num = numBgToFixed;
    if (!numBg.isZero() && decimalPlaces < decimals) {
        diff = numBgToFixed.split(numBgToString).join('');
        num = numBgToString;
    }

    return {
        num,
        diff,
    };
};
