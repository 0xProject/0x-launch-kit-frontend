import { ContractWrappers } from '0x.js';

import { Web3WrapperService } from './web3_wrapper';

let contractWrappers: ContractWrappers;

export const getContractWrappers = async () => {
    if (!contractWrappers) {
        const web3Service = Web3WrapperService.instance();
        const web3Wrapper = await web3Service.getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });
    }

    return contractWrappers;
};
