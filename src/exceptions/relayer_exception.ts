import { getErrorResponseFrom0xConnectErrorMessage } from '../util/error_messages';

import { RELAYER_ERR } from './common';

export class RelayerException extends Error {
    constructor(m: string) {
        // The error object comes from the relayer as a string, we convert it to JSON before displaying it
        let errorMsg = m;
        const errorObject = getErrorResponseFrom0xConnectErrorMessage(m);
        if (errorObject) {
            // Once it's converted, we extract the error msg to display
            const reasonUnformated = errorObject.validationErrors[0].reason;
            errorMsg = reasonUnformated ? reasonUnformated.split('_').join(' ') : RELAYER_ERR;
        }
        super(errorMsg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RelayerException.prototype);
    }
}
