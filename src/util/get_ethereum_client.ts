import { Web3Wrapper } from '@0x/web3-wrapper';

let web3Wrapper: Web3Wrapper | null = null;

export const getEthereumClient = async () => {
    if (web3Wrapper) {
        return web3Wrapper;
    }

    const provider: any = window.ethereum || window.web3;

    if (window.ethereum) {
        web3Wrapper = new Web3Wrapper(provider);

        try {
            // Request account access if needed
            await provider.enable();

            return web3Wrapper;
        } catch (error) {
            // TODO: User denied account access
            return null;
        }
    } else if (window.web3) {
        web3Wrapper = new Web3Wrapper(window.web3.currentProvider);
        return web3Wrapper;
    } else {
        return null;
    }
};
