import { ContractWrappers } from '0x.js';

import { getWeb3Wrapper } from './web3_wrapper';

let contractWrappers: ContractWrappers;

export const getContractWrappers = async () => {
    if (!contractWrappers) {
        const web3Wrapper = await getWeb3Wrapper();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });
    }

    return contractWrappers;
};
