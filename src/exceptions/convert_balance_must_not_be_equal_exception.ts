export class ConvertBalanceMustNotBeEqualException extends Error {
    constructor() {
        super(`You values to convert must not be equal`);
    }
}
