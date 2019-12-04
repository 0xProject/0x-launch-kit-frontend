import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { Token, TokenBalance } from '../util/types';

import { getContractWrappers } from './contract_wrappers';

export const tokensToTokenBalances = async (tokens: Token[], address: string): Promise<TokenBalance[]> => {
    const contractWrappers = await getContractWrappers();
    const assetDatas = tokens.map(t => assetDataUtils.encodeERC20AssetData(t.address));
    const [balances, allowances] = await contractWrappers.devUtils
        .getBatchBalancesAndAssetProxyAllowances(address, assetDatas)
        .callAsync();
    const tokenBalances = balances.map((_b: any, i: any) => {
        return {
            token: tokens[i],
            balance: balances[i],
            isUnlocked: allowances[i].isGreaterThan(0),
        };
    });
    return tokenBalances;
};
export const tokenToTokenBalance = async (token: Token, address: string): Promise<TokenBalance> => {
    const [tokenBalance] = await tokensToTokenBalances([token], address);
    return tokenBalance;
};

export const getTokenBalance = async (token: Token, address: string): Promise<BigNumber> => {
    const balance = await tokenToTokenBalance(token, address);
    return balance.balance;
};
