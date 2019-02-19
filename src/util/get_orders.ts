import { assetDataUtils } from '0x.js';

import { getContractWrappers } from '../services/contract_wrappers';
import { getRelayer } from '../services/relayer';
import { Token } from '../util/types';

import { ordersToUIOrders } from './ui_orders';

export const getAllOrders = (token: Token) => {
    const relayer = getRelayer();
    const tokenAssetData = assetDataUtils.encodeERC20AssetData(token.address);
    return relayer.getAllOrdersAsync(tokenAssetData);
};

export const getAllOrdersAsUIOrders = async (token: Token) => {
    const orders = await getAllOrders(token);
    const contractWrappers = await getContractWrappers();
    const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
    return ordersToUIOrders(orders, ordersInfo, token);
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
    return ordersToUIOrders(myOrders, myOrdersInfo, token);
};
