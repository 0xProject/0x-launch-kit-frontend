import { SignedOrder } from '@0x/connect';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { getLogger } from '../util/logger';
import { getTransactionOptions } from '../util/transactions';
import { Token } from '../util/types';
import { ordersToIEOUIOrders, ordersToUIOrders } from '../util/ui_orders';

import { getContractWrappers } from './contract_wrappers';
import { getRelayer, getUserIEOSignedOrders } from './relayer';
import { getWeb3Wrapper } from './web3_wrapper';

const logger = getLogger('Services::Orders');

export const getAllOrders = async (baseToken: Token, quoteToken: Token, makerAddresses: string[] | null) => {
    const relayer = getRelayer();
    const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
    const orders = await relayer.getAllOrdersAsync(baseTokenAssetData, quoteTokenAssetData);

    // if makerAddresses is null or empty do not filter
    if (!makerAddresses || makerAddresses.length === 0) {
        return orders;
    }

    // filter orders by existence in the makerAddresses array
    const filteredOrders = orders.filter(order => {
        const orderMakerAddress = order.makerAddress;
        return makerAddresses.includes(orderMakerAddress);
    });
    return filteredOrders;
};

export const getAllOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token, makerAddresses: string[] | null) => {
    const orders: SignedOrder[] = await getAllOrders(baseToken, quoteToken, makerAddresses);
    try {
        const contractWrappers = await getContractWrappers();
        const [ordersInfo] = await contractWrappers.devUtils
            .getOrderRelevantStates(
                orders,
                orders.map(o => o.signature),
            )
            .callAsync();
        return ordersToUIOrders(orders, baseToken, ordersInfo);
    } catch (err) {
        logger.error(`There was an error getting the orders' info from exchange.`, err);
        throw err;
    }
};

export const getAllOrdersAsUIOrdersWithoutOrdersInfo = async (
    baseToken: Token,
    quoteToken: Token,
    makerAddresses: string[] | null,
) => {
    const orders: SignedOrder[] = await getAllOrders(baseToken, quoteToken, makerAddresses);
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
        const [ordersInfo] = await contractWrappers.devUtils
            .getOrderRelevantStates(
                myOrders,
                myOrders.map(o => o.signature),
            )
            .callAsync();
        return ordersToUIOrders(myOrders, baseToken, ordersInfo);
    } catch (err) {
        logger.error(`There was an error getting the orders' info from exchange.`, err);
        throw err;
    }
};

export const cancelSignedOrder = async (order: SignedOrder, gasPrice: BigNumber) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();
    const tx = await contractWrappers.exchange.cancelOrder(order).sendTransactionAsync({
        from: order.makerAddress,
        ...getTransactionOptions(gasPrice),
    });
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};

export const getUserIEOOrdersAsUIOrders = async (baseToken: Token, quoteToken: Token, ethAccount: string) => {
    const myOrders = await getUserIEOSignedOrders(ethAccount, baseToken, quoteToken);
    try {
        const contractWrappers = await getContractWrappers();
        const [ordersInfo] = await contractWrappers.devUtils
            .getOrderRelevantStates(
                myOrders,
                myOrders.map(o => o.signature),
            )
            .callAsync();
        return ordersToIEOUIOrders(myOrders, baseToken, ordersInfo);
    } catch (err) {
        logger.error(`There was an error getting the ieo orders info from exchange.`, err);
        throw err;
    }
};
