import { assetDataUtils, BigNumber } from '0x.js';

import { Token, TokenBalance } from '../util/types';
import { CoinDetailCoinGecko } from '../util/types/coingecko';

import { getContractWrappers } from './contract_wrappers';

const TOKEN_CONTRACT_ENDPOINT = 'https://api.coingecko.com/api/v3/coins/ethereum/contract/';

export const tokensToTokenBalances = async (tokens: Token[], address: string): Promise<TokenBalance[]> => {
    const contractWrappers = await getContractWrappers();
    const assetDatas = tokens.map(t => assetDataUtils.encodeERC20AssetData(t.address));
    const balancesAndAllowances = await contractWrappers.orderValidator.getBalancesAndAllowancesAsync(
        address,
        assetDatas,
    );
    const tokenBalances = balancesAndAllowances.map((b, i) => ({
        token: tokens[i],
        balance: b.balance,
        isUnlocked: b.allowance.isGreaterThan(0),
    }));
    return tokenBalances;
};
export const tokenToTokenBalance = async (token: Token, address: string): Promise<TokenBalance> => {
    const contractWrappers = await getContractWrappers();

    const assetData = assetDataUtils.encodeERC20AssetData(token.address);
    const balanceAndAllowance = await contractWrappers.orderValidator.getBalanceAndAllowanceAsync(address, assetData);
    const { balance, allowance } = balanceAndAllowance;

    const isUnlocked = allowance.isGreaterThan(0);

    return {
        token,
        balance,
        isUnlocked,
    };
};

export const getTokenBalance = async (token: Token, address: string): Promise<BigNumber> => {
    const contractWrappers = await getContractWrappers();
    return contractWrappers.erc20Token.getBalanceAsync(token.address, address);
};

export const getTokenByAddress = async (address: string): Promise<CoinDetailCoinGecko> => {
    const promiseTokenDataResolved = await fetch(`${TOKEN_CONTRACT_ENDPOINT}${address.toLowerCase()}`);
    if (promiseTokenDataResolved.status === 200) {
        const data = await promiseTokenDataResolved.json();
        if (data) {
            return data;
        }
    }
    return Promise.reject('Could not get Token ');
};
