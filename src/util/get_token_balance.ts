import { BigNumber, ContractWrappers } from '0x.js';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { getEthereumClient } from './get_ethereum_client';
import { Token } from './types';

export const getTokenBalance = async (token: Token, address: string): Promise<BigNumber> => {
    const web3Wrapper = (await getEthereumClient()) as Web3Wrapper;
    const networkId = await web3Wrapper.getNetworkIdAsync();
    const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });
    return contractWrappers.erc20Token.getBalanceAsync(token.address, address);
};
