import { Web3Wrapper } from '@0x/web3-wrapper';

import { METAMASK_DEFAULT_ERROR, METAMASK_NOT_INSTALLED, METAMASK_USER_DENIED_AUTH } from '../common/constants';
import { Web3State } from '../util/types';

let web3Wrapper: Web3Wrapper | null = null;
let web3Status: Web3State = Web3State.Loading;

export const reconnectWallet = async (): Promise<Web3Wrapper | null> => {
    web3Status = Web3State.Loading;
    return getWeb3Wrapper();
};

export const getWeb3Wrapper = async (): Promise<Web3Wrapper | null> => {
    const { ethereum, web3, location } = window;
    if (web3Wrapper) {
        return web3Wrapper;
    }
    if (web3Status === Web3State.Locked || web3Status === Web3State.NotInstalled) {
        return null;
    }

    const provider: any = ethereum || web3;

    if (ethereum) {
        try {
            web3Wrapper = new Web3Wrapper(provider);
            // Request account access if needed
            await provider.enable();

            // Subscriptions register
            ethereum.on('accountsChanged', async (accounts: []) => {
                // Reload to avoid MetaMask bug: "MetaMask - RPC Error: Internal JSON-RPC"
                location.reload();
            });
            ethereum.on('networkChanged', async (network: number) => {
                location.reload();
            });
            web3Status = Web3State.Done;
        } catch (error) {
            /* The user denied account access */
            web3Wrapper = null;
            web3Status = Web3State.Locked;
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
    } else {
        /*  The user does not have metamask installed */
        web3Wrapper = null;
        web3Status = Web3State.NotInstalled;
    }
    return web3Wrapper;
};

export const getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
    const web3WrapperOrNull = await getWeb3Wrapper();

    if (!web3WrapperOrNull) {
        switch (web3Status) {
            case Web3State.NotInstalled: {
                throw new Error(METAMASK_NOT_INSTALLED);
            }
            case Web3State.Locked: {
                throw new Error(METAMASK_USER_DENIED_AUTH);
            }
            default: {
                throw new Error(METAMASK_DEFAULT_ERROR);
            }
        }
    } else {
        return web3WrapperOrNull;
    }
};
