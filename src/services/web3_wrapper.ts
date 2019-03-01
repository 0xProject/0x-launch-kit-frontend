import { Web3Wrapper } from '@0x/web3-wrapper';

let web3Wrapper: Web3Wrapper | null = null;

export const getWeb3Wrapper = async () => {
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

            /* Subscriptions register **/
            ethereum.on('accountsChanged', async (accounts: []) => {
                /* Performs a reload to avoid a bug with MetaMask: "MetaMask - RPC Error: Internal JSON-RPC" **/
                location.reload();
            });
            ethereum.on('networkChanged', async (network: number) => {
                location.reload();
            });

            return web3Wrapper;
        } catch (error) {
            // TODO: User denied account access
            return null;
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        return web3Wrapper;
    } else {
        return null;
    }
};

export const getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
    const web3WrapperOrNull = await getWeb3Wrapper();

    if (!web3WrapperOrNull) {
        throw new Error('web3 is not present');
    }

    return web3WrapperOrNull;
};
