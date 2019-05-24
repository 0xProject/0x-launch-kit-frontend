import { TokenSymbol } from '../util/types';

export class InsufficientQuoteTokenException extends Error {
    constructor(quoteSymbol: TokenSymbol) {
        super(`You don't have enough ${quoteSymbol}...`);
    }
}
