import { USER_DENIED_TRANSACTION_SIGNATURE_ERR } from './common';

export class UserDeniedTransactionSignatureException extends Error {
    constructor(m: string = USER_DENIED_TRANSACTION_SIGNATURE_ERR) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UserDeniedTransactionSignatureException.prototype);
    }
}
