import { getErrorResponseFrom0xConnectErrorMessage } from '../util/error_messages';

export class RelayerException extends Error {
    constructor(m: string) {
        // The error object comes from the relayer as a string, we convert it to JSON before displaying it
        let errorMsg = m;
        const errorObject = getErrorResponseFrom0xConnectErrorMessage(m);
        if (errorObject) {
            // Once it's converted, we extract the error msg to display
            const reasonUnformated = errorObject.validationErrors[0].reason;
            errorMsg = reasonUnformated ? reasonUnformated.split('_').join(' ') : 'There was an error with the relayer';
        }
        super(errorMsg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RelayerException.prototype);
    }
}
