export class InsufficientTokenBalanceException extends Error {
    constructor(quoteSymbol: string) {
        super(`You don't have enough ${quoteSymbol.toUpperCase()}...`);
    }
}
