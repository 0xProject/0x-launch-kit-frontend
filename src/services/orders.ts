import { assetDataUtils, BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { getLogger } from '../util/logger';
import { getTransactionOptions } from '../util/transactions';
import { Token } from '../util/types';
import { ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getRelayer } from './relayer';
import { getWeb3Wrapper } from './web3_wrapper';

const logger = getLogger('Services::Orders');

export const getAllOrders = (baseToken: Token, quoteToken: Token) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    return relayer.getAllOrdersAsync(baseTokenAssetData, quoteTokenAssetData);
};

export const getAllOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token) => {
    const orders: SignedOrder[] = await getAllOrders(baseToken, quoteToken);
    try {
        const contractWrappers = await getContractWrappers();
        const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
        return ordersToUIOrders(orders, baseToken, ordersInfo);
    } catch (err) {
        logger.error(`There was an error getting the orders' info from exchange.`, err);
        throw err;
    }
};

export const getAllOrdersAsUIOrdersWithoutOrdersInfo = async (baseToken: Token, quoteToken: Token) => {
    const orders: SignedOrder[] = await getAllOrders(baseToken, quoteToken);
    return ordersToUIOrders(orders, baseToken);
};

export const getUserOrders = (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    return relayer.getUserOrdersAsync(ethAccount, baseTokenAssetData, quoteTokenAssetData);
};

export const getUserOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const myOrders = await getUserOrders(baseToken, quoteToken, ethAccount);
    try {
        const contractWrappers = await getContractWrappers();
        const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
        return ordersToUIOrders(myOrders, baseToken, myOrdersInfo);
    } catch (err) {
        logger.error(`There was an error getting the orders' info from exchange.`, err);
        throw err;
    }
};

export const cancelSignedOrder = async (order: SignedOrder, gasPrice: BigNumber) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();
    const tx = await contractWrappers.exchange.cancelOrderAsync(order, getTransactionOptions(gasPrice));
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
