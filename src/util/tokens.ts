import { BigNumber } from '0x.js';

import { UI_DECIMALS_DISPLAYED_ORDER_SIZE } from '../common/constants';

import { isWeth } from './known_tokens';
import { TokenSymbol } from './types';

export const tokenSymbolToDisplayString = (symbol: TokenSymbol): string => {
    return isWeth(symbol) ? 'wETH' : symbol.toString().toUpperCase();
};

export const orderSizeInUnits = (amount: BigNumber, decimals: number): string => {
    const decimalsPerToken = new BigNumber(10).pow(decimals);
    return amount.div(decimalsPerToken).toFixed(UI_DECIMALS_DISPLAYED_ORDER_SIZE);
};
