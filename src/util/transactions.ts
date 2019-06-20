import { BigNumber } from '0x.js';
import retry from 'async-retry';

import { TX_DEFAULTS } from '../common/constants';
import { getWeb3Wrapper } from '../services/web3_wrapper';

const GET_BLOCK_NUMBER_FROM_TRANSACTION_HASH_RETRIES = 10;

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

export const getBlockNumberFromTransactionHash = async (txHash: string | undefined): Promise<number | undefined> => {
    try {
        if (!txHash) {
            throw new Error('Transaction hash was not provided');
        }

        const web3Wrapper = await getWeb3Wrapper();
        return retry(
            async () => {
                const transaction = await web3Wrapper.getTransactionByHashAsync(txHash);
                if (transaction.blockNumber === null) {
                    throw new Error('retry');
                }
                return transaction.blockNumber || undefined;
            },
            {
                retries: GET_BLOCK_NUMBER_FROM_TRANSACTION_HASH_RETRIES,
            },
        );
    } catch (err) {
        return Promise.resolve(undefined);
    }
};
