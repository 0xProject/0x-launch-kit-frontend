import { assetDataUtils, BigNumber, ContractWrappers } from '0x.js';
import { createAction } from 'typesafe-actions';

import { getContractWrappers } from '../services/contract_wrappers';
import { getRelayer } from '../services/relayer';
import { getWeb3Wrapper } from '../services/web3_wrapper';
import { getTokenBalance, tokenToTokenBalance } from '../util/get_token_balance';
import { getKnownTokens, getTokenBySymbol, getWethToken } from '../util/known_tokens';
import { Token, TokenBalance, UIOrder, Web3State } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import * as constants from './constants';
import { getEthAccount, getTokenBalances } from './selectors';

export const setEthAccount = createAction(constants.SET_ETH_ACCOUNT, resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction(constants.SET_WEB3_STATE, resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction(constants.SET_TOKEN_BALANCES, resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setWethBalance = createAction(constants.SET_WETH_BALANCE, resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setOrders = createAction(constants.SET_ORDERS, resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction(constants.SET_USER_ORDERS, resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setSelectedToken = createAction(constants.SET_SELECTED_TOKEN, resolve => {
    return (selectedToken: Token | null) => resolve(selectedToken);
});

export const unlockToken = (token: Token) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const tokenBalances = getTokenBalances(state);

        const contractWrappers = await getContractWrappers();
        await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(token.address, ethAccount);

        const updatedTokenBalances = tokenBalances.map(tokenBalance => {
            if (tokenBalance.token.address !== token.address) {
                return tokenBalance;
            }

            return {
                ...tokenBalance,
                isUnlocked: true,
            };
        });

        dispatch(setTokenBalances(updatedTokenBalances));
    };
};

export const initWallet = () => {
    return async (dispatch: any) => {
        dispatch(setWeb3State(Web3State.Loading));

        const web3Wrapper = await getWeb3Wrapper();

        const relayer = getRelayer();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const tokenBalances = await Promise.all(knownTokens.map(token => tokenToTokenBalance(token, ethAccount)));

            const wethToken = getWethToken(networkId);

            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            const selectedToken = getTokenBySymbol(networkId, 'ZRX');
            const selectedTokenAssetData = assetDataUtils.encodeERC20AssetData(selectedToken.address);

            const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });

            const orders = await relayer.getAllOrdersAsync(selectedTokenAssetData);
            const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
            const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

            const myOrders = await relayer.getUserOrdersAsync(ethAccount, selectedTokenAssetData);
            const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
            const myUIOrders = ordersToUIOrders(myOrders, myOrdersInfo, selectedToken);

            dispatch(setTokenBalances(tokenBalances));
            dispatch(setWethBalance(wethBalance));
            dispatch(setEthAccount(ethAccount));
            dispatch(setWeb3State(Web3State.Done));
            dispatch(setSelectedToken(selectedToken));
            dispatch(setOrders(uiOrders));
            dispatch(setUserOrders(myUIOrders));
        } else {
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};
