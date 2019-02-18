import { assetDataUtils, BigNumber, ContractWrappers } from '0x.js';
import { SignedOrder } from '@0x/connect';
import { createAction } from 'typesafe-actions';

import { getContractWrappers } from '../services/contract_wrappers';
import { getRelayer } from '../services/relayer';
import { getWeb3Wrapper, getWeb3WrapperOrThrow } from '../services/web3_wrapper';
import { getTokenBalance, tokenToTokenBalance } from '../util/get_token_balance';
import { getKnownTokens, getTokenBySymbol, getWethToken } from '../util/known_tokens';
import { BlockchainState, RelayerState, Token, TokenBalance, UIOrder, Web3State } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getEthAccount, getTokenBalances, getWethBalance } from './selectors';

export const initializeBlockchainData = createAction('INITIALIZE_BLOCKCHAIN_DATA', resolve => {
    return (blockchainData: BlockchainState) => resolve(blockchainData);
});

export const initializeRelayerData = createAction('INITIALIZE_RELAYER_DATA', resolve => {
    return (relayerData: RelayerState) => resolve(relayerData);
});

export const setEthAccount = createAction('SET_ETH_ACCOUNT', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setWeb3State = createAction('SET_WEB3_STATE', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setTokenBalances = createAction('SET_TOKEN_BALANCES', resolve => {
    return (tokenBalances: TokenBalance[]) => resolve(tokenBalances);
});

export const setEthBalance = createAction('SET_ETH_BALANCE', resolve => {
    return (ethBalance: BigNumber) => resolve(ethBalance);
});

export const setWethBalance = createAction('SET_WETH_BALANCE', resolve => {
    return (wethBalance: BigNumber) => resolve(wethBalance);
});

export const setOrders = createAction('SET_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setUserOrders = createAction('SET_USER_ORDERS', resolve => {
    return (orders: UIOrder[]) => resolve(orders);
});

export const setSelectedToken = createAction('SET_SELECTED_TOKEN', resolve => {
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

export const updateWethBalance = (newWethBalance: BigNumber) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const wethBalance = getWethBalance(state);

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const wethAddress = getWethToken(networkId).address;

        const contractWrappers = await getContractWrappers();

        let tx: string;
        if (wethBalance.lessThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.depositAsync(wethAddress, newWethBalance.sub(wethBalance), ethAccount);
        } else if (wethBalance.greaterThan(newWethBalance)) {
            tx = await contractWrappers.etherToken.withdrawAsync(wethAddress, wethBalance.sub(newWethBalance), ethAccount, {
                gasLimit: 1000000,
            });
        } else {
            return;
        }

        await web3Wrapper.awaitTransactionSuccessAsync(tx);
        const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);

        dispatch(setEthBalance(ethBalance));
        dispatch(setWethBalance(newWethBalance));
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

            const ethBalance = await web3Wrapper.getBalanceInWeiAsync(ethAccount);
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

            dispatch(initializeBlockchainData({
                web3State: Web3State.Done,
                ethAccount,
                ethBalance,
                wethBalance,
                tokenBalances,
            }));
            dispatch(initializeRelayerData({
                orders: uiOrders,
                userOrders: myUIOrders,
                selectedToken,
            }));
        } else {
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};

export const cancelOrder = (order: SignedOrder) => {
    return async (dispatch: any, getState: any) => {
        const state = getState();
        const ethAccount = getEthAccount(state);

        const web3Wrapper = await getWeb3WrapperOrThrow();
        const networkId = await web3Wrapper.getNetworkIdAsync();
        const contractWrappers = new ContractWrappers(web3Wrapper.getProvider(), { networkId });
        const tx = await contractWrappers.exchange.cancelOrderAsync(order, {
            gasLimit: 1000000,
        });
        await web3Wrapper.awaitTransactionSuccessAsync(tx);

        const relayer = getRelayer();
        const selectedToken = getTokenBySymbol(networkId, 'ZRX');
        const selectedTokenAssetData = assetDataUtils.encodeERC20AssetData(selectedToken.address);

        const orders = await relayer.getAllOrdersAsync(selectedTokenAssetData);
        const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
        const uiOrders = ordersToUIOrders(orders, ordersInfo, selectedToken);

        const myOrders = await relayer.getUserOrdersAsync(ethAccount, selectedTokenAssetData);
        const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
        const myUIOrders = ordersToUIOrders(myOrders, myOrdersInfo, selectedToken);

        dispatch(setOrders(uiOrders));
        dispatch(setUserOrders(myUIOrders));
    };
};
