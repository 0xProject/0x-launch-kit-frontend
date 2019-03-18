import { Web3Wrapper } from '@0x/web3-wrapper';

import { METAMASK_NOT_INSTALLED, METAMASK_USER_DENIED_AUTH } from '../common/constants';

let web3Wrapper: Web3Wrapper | null = null;

export const getWeb3Wrapper = async (): Promise<Web3Wrapper> => {
    const { ethereum, web3, location } = window;
    if (web3Wrapper) {
        return web3Wrapper;
    }

    const provider: any = ethereum || web3;

    if (ethereum) {
        web3Wrapper = new Web3Wrapper(provider);

        try {
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
            return web3Wrapper;
        } catch (error) {
            web3Wrapper = null;
            /* The user denied account access */
            throw new Error(METAMASK_USER_DENIED_AUTH);
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        return web3Wrapper;
    } else {
        /*  The user does not have metamask installed */
        throw new Error(METAMASK_NOT_INSTALLED);
    }
};

export const getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
    const web3WrapperOrNull = await getWeb3Wrapper();

    if (!web3WrapperOrNull) {
        throw new Error('web3 is not present');
    }

    return web3WrapperOrNull;
};
