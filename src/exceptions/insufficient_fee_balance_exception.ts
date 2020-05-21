import { INSUFFICIENT_FEE_BALANCE_MSG } from './common';

export class InsufficientFeeBalanceException extends Error {
    constructor() {
        super(INSUFFICIENT_FEE_BALANCE_MSG);
    }
}
