import { BigNumber } from '0x.js';

import { Token } from './types';

export const tokenAmountInUnits = (token: Token, amount: BigNumber): string => {
    const decimalsPerToken = new BigNumber(10).pow(token.decimals);

    return amount
        .div(decimalsPerToken)
        .toFixed(2);
};
