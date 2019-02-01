import { assetDataUtils, BigNumber, ContractWrappers } from '0x.js';
import { createAction } from 'typesafe-actions';

import { getRelayer } from '../services/relayer';
import { getEthereumClient } from '../util/get_ethereum_client';
import { getTokenBalance } from '../util/get_token_balance';
import { getKnownTokens, getTokenBySymbol, getWethToken } from '../util/known_tokens';
import { Token, TokenBalance, UIOrder, Web3State } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import * as constants from './constants';

export const setEthAccount = createAction(constants.SET_ETH_ACCOUNT, resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction(constants.SET_WEB3_STATE, resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setKnownTokens = createAction(constants.SET_KNOWN_TOKENS, resolve => {
    return (knownTokens: TokenBalance[]) => resolve(knownTokens);
});

export const setWethBalance = createAction(constants.SET_WETH_BALANCE, resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setOrders = createAction(constants.SET_ORDERS, resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setSelectedToken = createAction(constants.SET_SELECTED_TOKEN, resolve => {
    return (selectedToken: Token | null) => resolve(selectedToken);
});

export const initWallet = () => {
    return async (dispatch: any) => {
        dispatch(setWeb3State(Web3State.Loading));

        const web3Wrapper = await getEthereumClient();

        const relayer = getRelayer();

        if (web3Wrapper) {
            const [ethAccount] = await web3Wrapper.getAvailableAddressesAsync();
            const networkId = await web3Wrapper.getNetworkIdAsync();

            const knownTokens = getKnownTokens(networkId);

            const balances = await Promise.all(knownTokens.map(token => getTokenBalance(token, ethAccount)));
            const tokenBalances = knownTokens.map((token, index) => {
                return {
                    token,
                    balance: balances[index],
                };
            });

            const wethToken = getWethToken(networkId);

            const wethBalance = await getTokenBalance(wethToken, ethAccount);

            const selectedToken = getTokenBySymbol(networkId, 'ZRX');
            const selectedTokenAssetData = assetDataUtils.encodeERC20AssetData(selectedToken.address);

            const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });

            const mySellOrders = await relayer
                .getOrdersAsync({
                    makerAddress: ethAccount,
                    makerAssetData: selectedTokenAssetData,
                })
                .then(page => page.records)
                .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
            const myBuyOrders = await relayer
                .getOrdersAsync({
                    makerAddress: ethAccount,
                    takerAssetData: selectedTokenAssetData,
                })
                .then(page => page.records)
                .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
            const myOrders = [...mySellOrders, ...myBuyOrders];
            const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
            const myUIOrders = ordersToUIOrders(myOrders, myOrdersInfo, selectedToken);

            dispatch(setKnownTokens(tokenBalances));
            dispatch(setWethBalance(wethBalance));
            dispatch(setEthAccount(ethAccount));
            dispatch(setWeb3State(Web3State.Done));
            dispatch(setSelectedToken(selectedToken));
            dispatch(setOrders(myUIOrders));
        } else {
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};
