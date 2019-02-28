import { Web3Wrapper } from '@0x/web3-wrapper';

import { getKnownTokens } from '../util/known_tokens';
import { Web3DataWrapper, Web3State } from '../util/types';

import { getTokenBalance, tokenToTokenBalance } from './tokens';

let web3Wrapper: Web3Wrapper | null = null;

let web3Data: null | Web3DataWrapper = null;

export const getWeb3Wrapper = () => {
    if (web3Wrapper) {
        return web3Wrapper;
    }
    return initWeb3();
};

export const getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
    const web3WrapperOrNull = await getWeb3Wrapper();

    if (!web3WrapperOrNull) {
        throw new Error('web3 is not present');
    }

    return web3WrapperOrNull;
};

const initWeb3 = async () => {
    const { ethereum, web3 } = window;
    const provider: any = ethereum || web3;

    if (ethereum) {
        web3Wrapper = new Web3Wrapper(provider);
        try {
            // Request account access if needed
            await provider.enable();
        } catch (error) {
            // TODO: User denied account access
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        return web3Wrapper;
    } else {
        // TODO: User does not have web3 installed
    }
    return web3Wrapper;
};

/* Event to detect if user has changed the account */
export const accountChangedSubscription = async (onChangeCb: (web3Data: Web3DataWrapper | null) => void) => {
    const { ethereum } = window;
    if (!web3Wrapper || !onChangeCb) {
        return;
    }
    web3Data = await getWeb3DataWrapper();
    ethereum.on('accountsChanged', async (accounts: []) => {
        web3Data = await getWeb3DataWrapper();
        onChangeCb(web3Data);
    });
    return web3Data;
};

/* Event to detect if user has changed the network */
export const networkChangedSubscription = async (onChangeCb: (web3Data: Web3DataWrapper | null) => void) => {
    const { ethereum } = window;
    if (!web3Wrapper || !onChangeCb) {
        return;
    }
    web3Data = await getWeb3DataWrapper();
    ethereum.on('networkChanged', async (network: number) => {
        web3Data = await getWeb3DataWrapper();
        onChangeCb(web3Data);
    });
    return web3Data;
};

export const getWeb3DataWrapper = async (): Promise<null | Web3DataWrapper> => {
    web3Wrapper = await getWeb3Wrapper();
    if (!web3Wrapper) {
        return null;
    }
    const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
    const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
    const networkId = await web3Wrapper.getNetworkIdAsync();
    const knownTokens = getKnownTokens(networkId);
    const selectedToken = knownTokens.getTokenBySymbol('ZRX');
    const wethToken = knownTokens.getWethToken();
    const wethBalance = await getTokenBalance(wethToken, ethAccount);

    const tokenBalances = await Promise.all(
        knownTokens.getTokens().map(token => tokenToTokenBalance(token, ethAccount)),
    );

    const blockchainState = {
        web3State: Web3State.Done,
        ethAccount,
        ethBalance,
        wethBalance,
        tokenBalances,
        networkId,
    };

    const relayerState = {
        orders: [],
        userOrders: [],
        selectedToken,
    };

    web3Data = {
        blockchainState,
        relayerState,
    };
    return web3Data;
};
