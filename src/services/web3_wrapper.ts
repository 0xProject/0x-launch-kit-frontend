import { Web3Wrapper } from '@0x/web3-wrapper';

import {
    METAMASK_DEFAULT_ERROR,
    METAMASK_NOT_INSTALLED,
    METAMASK_USER_DENIED_AUTH,
    WEB3_INITIAL_STATE,
} from '../common/constants';
import { Web3State } from '../util/types';

export class Web3WrapperService {
    private static _instance: Web3WrapperService | null;
    private _web3Wrapper: Web3Wrapper | null;
    private _web3Status: Web3State;

    public static instance(): Web3WrapperService {
        if (!this._instance) {
            this._instance = new Web3WrapperService();
        }
        return this._instance;
    }

    public setWeb3Status = (web3Status: Web3State) => {
        this._web3Status = web3Status;
    };

    public reconnectWallet = () => {
        this._web3Status = Web3State.Loading;
        // return getWeb3Wrapper();
    };

    public checkIfMetamaskIsInstalled = (): boolean => {
        const { ethereum, web3 } = window;
        return ethereum || web3;
    };

    public getWeb3Wrapper = async (): Promise<Web3Wrapper | null> => {
        const { ethereum, web3, location } = window;
        if (this._web3Wrapper) {
            return this._web3Wrapper;
        }
        if (this._web3Status === Web3State.Locked || this._web3Status === Web3State.NotInstalled) {
            return null;
        }
        const provider: any = ethereum || web3;

        if (ethereum) {
            try {
                this._web3Wrapper = new Web3Wrapper(provider);
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
                this._web3Status = Web3State.Done;
            } catch (error) {
                // The user denied account access
                this._web3Wrapper = null;
                this._web3Status = Web3State.Locked;
            }
        } else if (web3) {
            this._web3Wrapper = new Web3Wrapper(web3.currentProvider);
        } else {
            //  The user does not have metamask installed
            this._web3Wrapper = null;
            this._web3Status = Web3State.NotInstalled;
        }
        return this._web3Wrapper;
    };

    public getWeb3WrapperOrThrow = async (): Promise<Web3Wrapper> => {
        const web3WrapperOrNull = await this.getWeb3Wrapper();

        if (!web3WrapperOrNull) {
            switch (this._web3Status) {
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

    private constructor(web3InitialStatus: Web3State = WEB3_INITIAL_STATE) {
        this._web3Wrapper = null;
        this._web3Status = web3InitialStatus;
    }
}
