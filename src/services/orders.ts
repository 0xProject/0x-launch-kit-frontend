import { assetDataUtils, BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';

import { TX_DEFAULTS } from '../common/constants';
import { getLogger } from '../util/logger';
import { Token, UIOrder } from '../util/types';
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
    let uiOrders = [];
    let orders: SignedOrder[] = [];

    try {
        orders = await getAllOrders(baseToken, quoteToken);
    } catch (error) {
        logger.error('The fetch orders from the relayer failed', error);
    }
    try {
        const contractWrappers = await getContractWrappers();
        const ordersInfo = await contractWrappers.exchange.getOrdersInfoAsync(orders);
        uiOrders = ordersToUIOrders(orders, baseToken, ordersInfo);
    } catch (error) {
        logger.error('There was an error with the contractWrappers', error);
        // We got an error from web3 getting the contract wrappers, we fetch the default orders without the ordersInfo
        uiOrders = ordersToUIOrders(orders, baseToken);
    }
    return uiOrders;
};

export const getUserOrders = (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    return relayer.getUserOrdersAsync(ethAccount, baseTokenAssetData, quoteTokenAssetData);
};

export const getUserOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    let myOrders = [];
    let uiOrders: UIOrder[] = [];
    try {
        myOrders = await getUserOrders(baseToken, quoteToken, ethAccount);
        const contractWrappers = await getContractWrappers();
        const myOrdersInfo = await contractWrappers.exchange.getOrdersInfoAsync(myOrders);
        uiOrders = ordersToUIOrders(myOrders, baseToken, myOrdersInfo);
    } catch (error) {
        logger.error('The fetch orders from the relayer failed', error);
    }
    return uiOrders;
};

export const cancelSignedOrder = async (order: SignedOrder, gasPrice: BigNumber) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();
    const tx = await contractWrappers.exchange.cancelOrderAsync(order, { ...TX_DEFAULTS, gasPrice });
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
