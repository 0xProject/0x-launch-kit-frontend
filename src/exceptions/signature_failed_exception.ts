export class SignatureFailedException extends Error {
    public stackError: string;
    constructor(message: string) {
        super('User denied message signature.');
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype);
        this.stackError = message;
    }
}
