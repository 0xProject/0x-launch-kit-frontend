import { ContractWrappers } from '0x.js';

import { NETWORK_ID } from '../common/constants';

import { getWeb3Wrapper } from './web3_wrapper';

let contractWrappers: ContractWrappers;

export const getContractWrappers = async () => {
    if (!contractWrappers) {
        const web3Wrapper = await getWeb3Wrapper();
        contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId: NETWORK_ID });
    }

    return contractWrappers;
};
