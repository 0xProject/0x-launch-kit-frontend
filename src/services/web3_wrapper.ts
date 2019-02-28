import { Web3Wrapper } from '@0x/web3-wrapper';

let web3Wrapper: Web3Wrapper | null = null;

export const getWeb3Wrapper = async () => {
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

export const getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
    const web3WrapperOrNull = await getWeb3Wrapper();

    if (!web3WrapperOrNull) {
        throw new Error('web3 is not present');
    }

    return web3WrapperOrNull;
};

/* Event to detect if user has changed the account */
export const accountChangedSubscription = (onChangeCb: () => void) => {
    const { ethereum } = window;
    if (!web3Wrapper || !onChangeCb) {
        return;
    }
    ethereum.on('accountsChanged', async (accounts: []) => {
        onChangeCb();
    });
};

/* Event to detect if user has changed the network */
export const networkChangedSubscription = (onChangeCb: () => void) => {
    const { ethereum } = window;
    if (!web3Wrapper || !onChangeCb) {
        return;
    }
    ethereum.on('networkChanged', async (network: number) => {
        onChangeCb();
    });
};
