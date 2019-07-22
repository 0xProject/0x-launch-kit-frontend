import { Web3Wrapper } from '@0x/web3-wrapper';
import Portis from '@portis/web3';
// @ts-ignore - no typings
import Fortmatic from 'fortmatic';

import { FORTMATIC_APP_ID, NETWORK_ID, NETWORK_NAME, PORTIS_APP_ID } from '../common/constants';
import { sleep } from '../util/sleep';
import { Wallet } from '../util/types';

import { LocalStorage } from './local_storage';

let web3Wrapper: Web3Wrapper | null = null;

const localStorage = new LocalStorage(window.localStorage);

export const isMetamaskInstalled = (): boolean => {
    const { ethereum, web3 } = window;
    return ethereum || web3;
};

export const initializeWeb3Wrapper = async (wallet: Wallet): Promise<Web3Wrapper | null> => {
    switch (wallet) {
        case Wallet.Portis:
            web3Wrapper = await initPortis();
            break;
        case Wallet.Metamask:
            web3Wrapper = await initMetamask();
            break;
        case Wallet.Torus:
            web3Wrapper = await initTorus();
            break;
        case Wallet.Fortmatic:
            web3Wrapper = await initFortmatic();
            break;
        default:
            break;
    }

    if (web3Wrapper) {
        return web3Wrapper;
    } else {
        return null;
    }
};
export const initMetamask = async (): Promise<Web3Wrapper | null> => {
    const { ethereum, web3, location } = window;
    if (ethereum) {
        try {
            web3Wrapper = new Web3Wrapper(ethereum);
            // Request account access if needed
            await ethereum.enable();
            // Subscriptions register
            ethereum.on('accountsChanged', async (accounts: []) => {
                // Reload to avoid MetaMask bug: "MetaMask - RPC Error: Internal JSON-RPC"
                location.reload();
            });
            ethereum.on('networkChanged', async (network: number) => {
                location.reload();
            });
            localStorage.saveWalletConnected(Wallet.Metamask);

            return web3Wrapper;
        } catch (error) {
            // The user denied account access
            return null;
        }
    } else if (web3) {
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        return web3Wrapper;
    } else {
        localStorage.resetWalletConnected();
        //  The user does not have metamask installed
        return null;
    }
};

export const initPortis = async (): Promise<Web3Wrapper | null> => {
    const { location } = window;
    if (!PORTIS_APP_ID) {
        return null;
    }
    try {
        const portis = new Portis(PORTIS_APP_ID, NETWORK_NAME.toLowerCase());
        web3Wrapper = new Web3Wrapper(portis.provider);
        const [account] = await web3Wrapper.getAvailableAddressesAsync();
        portis.onLogout(() => {
            localStorage.resetWalletConnected();
            location.reload();
        });
        portis.onLogin(() => {
            localStorage.saveWalletConnected(Wallet.Portis);
            location.reload();
        });
        if (account) {
            return web3Wrapper;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const initTorus = async (): Promise<Web3Wrapper | null> => {
    const importTorus = (): Promise<Web3Wrapper | null> => {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            import('@toruslabs/torus-embed')
                .then(async () => {
                    try {
                        resolve(await enableTorus());
                    } catch {
                        reject(null);
                    }
                })
                .catch(() => reject(null));
        });
    };

    const enableTorus = async () => {
        let { web3 } = window;
        // Torus need some time to inject web3
        while (!web3) {
            web3 = window.web3;
            // if web3Wrapper is not set yet, wait and retry
            await sleep(100);
        }
        const { ethereum, location } = window;
        const isTorus = sessionStorage.getItem('pageUsingTorus');
        if (isTorus) {
            return (web3Wrapper = new Web3Wrapper(web3.currentProvider));
        }
        await ethereum.enable();
        ethereum.on('accountsChanged', async (accounts: []) => {
            // Reload to avoid MetaMask bug: "MetaMask - RPC Error: Internal JSON-RPC"
            location.reload();
        });
        ethereum.on('networkChanged', async (network: number) => {
            location.reload();
        });
        web3Wrapper = new Web3Wrapper(web3.currentProvider);
        localStorage.saveWalletConnected(Wallet.Torus);
        sessionStorage.setItem('pageUsingTorus', 'true');
        return web3Wrapper;
    };

    try {
        return await importTorus();
    } catch {
        return null;
    }
};

export const initFortmatic = async (): Promise<Web3Wrapper | null> => {
    if (!FORTMATIC_APP_ID) {
        return null;
    }
    const fm =
        NETWORK_ID === 1
            ? new Fortmatic(FORTMATIC_APP_ID)
            : new Fortmatic(FORTMATIC_APP_ID, NETWORK_NAME.toLowerCase());

    web3Wrapper = new Web3Wrapper(fm.getProvider());
    let isUserLoggedIn = await fm.user.isLoggedIn();
    // user is already logged
    if (isUserLoggedIn) {
        return web3Wrapper;
    } else {
        await fm.user.login();
        isUserLoggedIn = await fm.user.isLoggedIn();
        if (isUserLoggedIn) {
            return web3Wrapper;
        } else {
            return null;
        }
    }
};

export const getWeb3Wrapper = async (): Promise<Web3Wrapper> => {
    while (!web3Wrapper) {
        // if web3Wrapper is not set yet, wait and retry
        await sleep(100);
    }

    return web3Wrapper;
};

export const deleteWeb3Wrapper = (): void => {
    web3Wrapper = null;
};
