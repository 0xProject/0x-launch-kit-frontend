import { TokenSymbol } from '../util/types';

export class InsufficientTokenBalanceException extends Error {
    constructor(quoteSymbol: TokenSymbol) {
        super(`You don't have enough ${quoteSymbol.toUpperCase()}...`);
    }
}
