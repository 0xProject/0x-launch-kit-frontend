import { BigNumber } from '0x.js';
import { createAction } from 'typesafe-actions';

import { getEthereumClient } from '../util/get_ethereum_client';
import { getTokenBalance } from '../util/get_token_balance';
import { getKnownTokens, getWethToken } from '../util/known_tokens';
import { TokenBalance } from '../util/types';

import * as constants from './constants';
import { Web3State } from './types';

export const setEthAccount = createAction(constants.SET_ETH_ACCOUNT, resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction(constants.SET_WEB3_STATE, resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setKnownTokens = createAction(constants.SET_KNOWN_TOKENS, resolve => {
    return (knownTokens: TokenBalance[]) => resolve(knownTokens);
});

export const setWethBalance = createAction(constants.SET_WETH_BALANCE, resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const initWallet = () => {
    return async (dispatch: any) => {
        dispatch(setWeb3State(Web3State.Loading));

        const web3Wrapper = await getEthereumClient();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const balances = await Promise.all(knownTokens.map(token => getTokenBalance(token, ethAccount)));
            const tokenBalances = knownTokens.map((token, index) => {
              return {
                token,
                balance: balances[index],
              };
            });

            const wethToken = getWethToken(networkId);

            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            dispatch(setKnownTokens(tokenBalances));
            dispatch(setWethBalance(wethBalance));
            dispatch(setEthAccount(ethAccount));
            dispatch(setWeb3State(Web3State.Done));
        } else {
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};
