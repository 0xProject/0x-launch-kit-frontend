export class UserDeniedTransactionSignatureException extends Error {
    constructor(m: string = 'User denied transaction signature') {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, UserDeniedTransactionSignatureException.prototype);
    }
}
