import { HttpClient } from '@0x/connect';
import { Provider, Web3Wrapper } from '@0x/web3-wrapper';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ActionType, getType } from 'typesafe-actions';

import { Relayer } from '../../services/relayer';
import { NotificationKind, StoreState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';

interface Web3MiddlewareOptions {
    window: {
        ethereum: any;
        location: Location;
        web3: any;
    };
    getWeb3Wrapper: (provider: Provider) => Web3Wrapper;
}

export const createWeb3Middleware: (options: Web3MiddlewareOptions) => Middleware = ({
    window,
    getWeb3Wrapper,
}: Web3MiddlewareOptions) => ({
    dispatch,
    getState,
}: MiddlewareAPI<ThunkDispatch<StoreState, {}, AnyAction>, StoreState>) => (next: Dispatch) => {
    const { ethereum, location, web3 } = window;
    let web3Wrapper: Web3Wrapper | null = null;

    return async (action: AnyAction) => {
        const result = next(action);

        // check if metamask is installed on start
        if (action.type === getType(actions.init)) {
            if (!ethereum && !web3) {
                dispatch(actions.web3NotInstalled());
            }
            return result;
        }

        if (action.type === getType(actions.connectWeb3.request)) {
            if (!ethereum && !web3) {
                return result;
            }
            if (web3Wrapper) {
                return result;
            }

            if (ethereum) {
                try {
                    web3Wrapper = getWeb3Wrapper(ethereum);
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

                    dispatch(actions.connectWeb3.success());
                } catch (error) {
                    // The user denied account access
                    dispatch(actions.connectWeb3.failure(error));
                }
            } else if (web3) {
                web3Wrapper = getWeb3Wrapper(web3.currentProvider);
                dispatch(actions.connectWeb3.success());
            }

            return result;
        }

        if (web3Wrapper) {
            if (action.type === getType(actions.connectWeb3.success)) {
                const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
                dispatch(actions.setEthAccount(ethAccount));
                return result;
            }
        }

        return result;
    };
};
