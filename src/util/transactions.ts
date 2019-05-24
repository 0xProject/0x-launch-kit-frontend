import { BigNumber } from '0x.js';

import { TX_DEFAULTS } from '../common/constants';

export const getTransactionOptions = (gasPrice: BigNumber) => {
    let options = {
        gasPrice,
    };

    if (process.env.NODE_ENV === 'development') {
        options = {
            ...options,
            ...TX_DEFAULTS,
        };
    }

    return options;
};
