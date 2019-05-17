export class BaseStepModalUnmountedException extends Error {
    constructor() {
        super('BaseStepModal unmounted');
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
