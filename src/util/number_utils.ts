import { BigNumber } from '0x.js';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE } from '../common/constants';

export const padRightSplitted = (
    numBg: BigNumber,
    decimals: number = UI_DECIMALS_DISPLAYED_ORDER_SIZE,
): { num: string; diff: string } => {
    const numBgToFixed = numBg.toFixed(decimals);
    const numBgToString = numBg.toString();

    const decimalPlaces = (numBgToString.split('.')[1] || []).length;

    let diff = '';
    let num = numBgToFixed;
    if (!numBg.isZero() && decimalPlaces < decimals) {
        diff = numBgToFixed.replace(numBgToString, '');
        num = numBgToString;
    }

    return {
        num,
        diff,
    };
};

export const truncateAddress = (address: string) => {
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};
