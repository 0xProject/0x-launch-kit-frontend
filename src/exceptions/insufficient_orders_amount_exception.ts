import { INSUFFICIENT_ORDERS_TO_FILL_AMOUNT_ERR } from './common';

export class InsufficientOrdersAmountException extends Error {
    constructor() {
        super(INSUFFICIENT_ORDERS_TO_FILL_AMOUNT_ERR);
    }
}
