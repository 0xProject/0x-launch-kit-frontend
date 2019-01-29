import { Web3Wrapper } from '@0x/web3-wrapper';
import { createAction } from 'typesafe-actions';

import { SET_ETH_ACCOUNT, SET_WEB3_STATE } from './constants';

export const setEthAccount = createAction(SET_ETH_ACCOUNT, resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction(SET_WEB3_STATE, resolve => {
    return (web3State: string) => resolve(web3State);
});

export function initWallet(): (dispatch: any) => any {
    return async (dispatch: any) => {
        dispatch(setWeb3State('loading'));

        const web3Wrapper = await createEthereumClient();

        if (web3Wrapper) {
            const accounts = await web3Wrapper.getAvailableAddressesAsync();

            dispatch(setEthAccount(accounts[0]));
            dispatch(setWeb3State('done'));
        } else {
            dispatch(setWeb3State('error'));
        }
    };
}

const createEthereumClient = async () => {
    const provider: any = window.ethereum || window.web3;

    if (window.ethereum) {
        const web3Wrapper = new Web3Wrapper(provider);

        try {
            // Request account access if needed
            await provider.enable();

            return web3Wrapper;
        } catch (error) {
            // TODO: User denied account access
            return null;
        }
    } else if (window.web3) {
        return new Web3Wrapper(window.web3.currentProvider);
    } else {
        return null;
    }
};
