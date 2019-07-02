import { BigNumber } from '0x.js';

import { isWeth } from './known_tokens';
import { NETWORK_ID } from '../common/constants';
import { ETHERSCAN_URL } from './transaction_link';
import { Token } from './types';

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

export const tokenSymbolToDisplayString = (symbol: string): string => {
    return isWeth(symbol) ? 'wETH' : symbol.toUpperCase();
};

export const getEtherscanLinkForToken = (token: Token): string => {
    return `${ETHERSCAN_URL[NETWORK_ID]}token/${token.address}`;
};
export const getEtherscanLinkForTokenAndAddress = (token: Token, ethAccount: string): string => {
    return `${ETHERSCAN_URL[NETWORK_ID]}token/${token.address}?a=${ethAccount}`;
};


