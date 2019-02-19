import { SignedOrder } from '@0x/connect';

import { TX_DEFAULTS } from '../common/constants';
import { getContractWrappers } from '../services/contract_wrappers';
import { getWeb3WrapperOrThrow } from '../services/web3_wrapper';

export const cancelSignedOrder = async (order: SignedOrder) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3WrapperOrThrow();
    const tx = await contractWrappers.exchange.cancelOrderAsync(order, TX_DEFAULTS);
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
