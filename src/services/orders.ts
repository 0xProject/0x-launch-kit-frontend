import { assetDataUtils } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { TX_DEFAULTS } from '../common/constants';
import { Token } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getRelayer } from './relayer';
import { getWeb3WrapperOrThrow } from './web3_wrapper';

export const getAllOrders = (token: Token) => {
    const relayer = getRelayer();
    const tokenAssetData = assetDataUtils.encodeERC20AssetData(token.address);
    return relayer.getAllOrdersAsync(tokenAssetData);
};

export const getAllOrdersAsUIOrders = async (token: Token) => {
    let uiOrders = [];
    const orders = await getAllOrders(token);
    try {
        const contractWrappers = await getContractWrappers();
        const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
        uiOrders = ordersToUIOrders(orders, token, ordersInfo);
    } catch (error) {
        /* We got an error from web3 getting the contract wrappers, we fetch the default orders without the ordersInfo **/
        uiOrders = ordersToUIOrders(orders, token);
    }
    return uiOrders;
};

export const getUserOrders = (token: Token, ethAccount: string) => {
    const relayer = getRelayer();
    const selectedTokenAssetData = assetDataUtils.encodeERC20AssetData(token.address);
    return relayer.getUserOrdersAsync(ethAccount, selectedTokenAssetData);
};

export const getUserOrdersAsUIOrders = async (token: Token, ethAccount: string) => {
    const myOrders = await getUserOrders(token, ethAccount);
    const contractWrappers = await getContractWrappers();
    const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
    return ordersToUIOrders(myOrders, token, myOrdersInfo);
};

export const cancelSignedOrder = async (order: SignedOrder) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3WrapperOrThrow();
    const tx = await contractWrappers.exchange.cancelOrderAsync(order, TX_DEFAULTS);
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
