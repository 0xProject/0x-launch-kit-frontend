import { BigNumber } from '0x.js';
// tslint:disable-next-line: no-implicit-dependencies
import { TxData } from 'ethereum-types';

import { iTokenContract } from '../util/bzx/contract_wrappers/i_token';
import { TokenizedRegistryContract } from '../util/bzx/contract_wrappers/tokenized_registry';
import { getTokenizedRegistryAddress } from '../util/bzx/contracts';
import { getKnownTokens } from '../util/known_tokens';
import { iTokenData, TokenMetadataBZX } from '../util/types';

import { getContractWrappers } from './contract_wrappers';
import { getWeb3Wrapper } from './web3_wrapper';

export const getITokenContractWrapper = async (address: string, partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    return new iTokenContract(address, web3Wrapper.getProvider(), partialTxData);
};

export const getTokenizedRegistryContractWrapper = async (partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    return new TokenizedRegistryContract(getTokenizedRegistryAddress(), web3Wrapper.getProvider(), partialTxData);
};

export const getAllITokens = async (ethAccount: string): Promise<[iTokenData[], TokenMetadataBZX[]]> => {
    let tokens;
    try {
        tokens = await (await getTokenizedRegistryContractWrapper({})).getTokens.callAsync(
            new BigNumber(0),
            new BigNumber(10),
            new BigNumber(0),
        );
    } catch (e) {
        // tslint:disable-next-line:no-console
        throw Error('Tokenized registry failure');
    }
    const iTokens: iTokenData[] = [];
    const known_tokens = getKnownTokens();

    for (const tk of tokens.filter(t => t.tokenType.isEqualTo(1))) {
        try {
            const contractWrappers = await getContractWrappers();
            const tkContract = await getITokenContractWrapper(tk.token, { from: ethAccount });
            const token = known_tokens.getTokenByAddress(tk.asset);
            const price = await tkContract.tokenPrice.callAsync();
            const checkpointPrice = await tkContract.checkpointPrice.callAsync(ethAccount);
            const avgBorrowInterestRate = await tkContract.avgBorrowInterestRate.callAsync();
            const totalReservedSupply = await tkContract.totalReservedSupply.callAsync();
            const marketLiquidity = await tkContract.marketLiquidity.callAsync();
            const balance = await tkContract.balanceOf.callAsync(ethAccount);
            const supplyInterestRate = await tkContract.supplyInterestRate.callAsync();
            const allowance = await contractWrappers.erc20Token.getAllowanceAsync(token.address, ethAccount, tk.token);
            const isUnlocked = allowance.isGreaterThan('10000e18');

            iTokens.push({
                address: tk.token,
                name: tk.name,
                symbol: tk.symbol,
                token,
                price,
                checkpointPrice,
                avgBorrowInterestRate,
                totalReservedSupply,
                marketLiquidity,
                balance,
                supplyInterestRate,
                isUnlocked,
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(`There was a problem with Itoken wrapper  ${tk.name}`, e);
        }
    }
    return [iTokens, (tokens as unknown) as TokenMetadataBZX[]];
};

export const getToken = async (ethAccount: string, iToken: iTokenData): Promise<iTokenData | undefined> => {
    let it;
    try {
        const known_tokens = getKnownTokens();
        const contractWrappers = await getContractWrappers();
        const tkContract = await getITokenContractWrapper(iToken.address, { from: ethAccount });
        const token = known_tokens.getTokenByAddress(iToken.token.address);
        const price = await tkContract.tokenPrice.callAsync();
        const checkpointPrice = await tkContract.checkpointPrice.callAsync(ethAccount);
        const avgBorrowInterestRate = await tkContract.avgBorrowInterestRate.callAsync();
        const totalReservedSupply = await tkContract.totalReservedSupply.callAsync();
        const marketLiquidity = await tkContract.marketLiquidity.callAsync();
        const balance = await tkContract.balanceOf.callAsync(ethAccount);
        const supplyInterestRate = await tkContract.supplyInterestRate.callAsync();
        const allowance = await contractWrappers.erc20Token.getAllowanceAsync(
            token.address,
            ethAccount,
            iToken.address,
        );
        const isUnlocked = allowance.isGreaterThan('10000e18');
        it = {
            address: iToken.address,
            name: iToken.name,
            symbol: iToken.symbol,
            token,
            price,
            checkpointPrice,
            avgBorrowInterestRate,
            totalReservedSupply,
            marketLiquidity,
            balance,
            supplyInterestRate,
            isUnlocked,
        };
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(`There was a problem with Itoken wrapper  ${iToken.name}`, e);
    }

    return it;
};
