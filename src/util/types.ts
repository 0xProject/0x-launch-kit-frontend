import { BigNumber } from '0x.js';

export interface Token {
    address: string;
    symbol: string;
    decimals: number;
}

export interface TokenBalance {
    token: Token;
    balance: BigNumber;
}
