import { BigNumber, ContractWrappers } from '0x.js';

import { NETWORK_ID } from '../common/constants';
import { Token, TokenBalance } from '../util/types';

import { getContractWrappers } from './contract_wrappers';
import { getWeb3Wrapper } from './web3_wrapper';

const MAX_UINT = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007913129639935');

export const tokenToTokenBalance = async (token: Token, address: string): Promise<TokenBalance> => {
    const contractWrappers = await getContractWrappers();

    const [balance, allowance] = await Promise.all([
        getTokenBalance(token, address),
        contractWrappers.erc20Token.getProxyAllowanceAsync(token.address, address),
    ]);

    const isUnlocked = allowance.eq(MAX_UINT);

    return {
        token,
        balance,
        isUnlocked,
    };
};

export const getTokenBalance = async (token: Token, address: string): Promise<BigNumber> => {
    const web3Wrapper = await getWeb3Wrapper();
    const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId: NETWORK_ID });
    return contractWrappers.erc20Token.getBalanceAsync(token.address, address);
};
