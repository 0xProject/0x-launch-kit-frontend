export class SignedOrderException extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, SignedOrderException.prototype);
    }
}
