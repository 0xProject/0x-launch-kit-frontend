import { ContractWrappers } from '@0x/contract-wrappers';
import { TxData } from 'ethereum-types';

import { CHAIN_ID } from '../common/constants';
import { erc20Contract } from '../util/contract_wrappers/erc20';

import { getWeb3Wrapper } from './web3_wrapper';

let contractWrappers: ContractWrappers;

export const getContractWrappers = async () => {
    if (!contractWrappers) {
        const web3Wrapper = await getWeb3Wrapper();
        contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { chainId: CHAIN_ID });
    }

    return contractWrappers;
};

export const getERC20ContractWrapper = async (address: string, partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    return new erc20Contract(address, web3Wrapper.getProvider(), partialTxData);
};
