import { SignedOrder } from '@0x/connect';
import { DevUtilsContract } from '@0x/contract-wrappers';
import { assetDataUtils } from '@0x/order-utils';
import { BigNumber } from '@0x/utils';

import { NETWORK_ID } from '../common/constants';
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
        // HACK(dekz): Kovan DevUtils in contract-wrappers is currently incorrect
        const devUtils =
            NETWORK_ID === 42
                ? new DevUtilsContract('0x6387a62a340de79f2f0353bd05d9567fe0aca955', contractWrappers.getProvider())
                : contractWrappers.devUtils;
        const [ordersInfo] = await devUtils.getOrderRelevantStates.callAsync(orders, orders.map(o => o.signature));
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
        const devUtils =
            NETWORK_ID === 42
                ? new DevUtilsContract('0x6387a62a340de79f2f0353bd05d9567fe0aca955', contractWrappers.getProvider())
                : contractWrappers.devUtils;
        const [ordersInfo] = await devUtils.getOrderRelevantStates.callAsync(myOrders, myOrders.map(o => o.signature));
        return ordersToUIOrders(myOrders, baseToken, ordersInfo);
    } catch (err) {
        logger.error(`There was an error getting the orders' info from exchange.`, err);
        throw err;
    }
};

export const cancelSignedOrder = async (order: SignedOrder, gasPrice: BigNumber) => {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();
    const tx = await contractWrappers.exchange.cancelOrder.sendTransactionAsync(order, {
        from: order.makerAddress,
        ...getTransactionOptions(gasPrice),
    });
    return web3Wrapper.awaitTransactionSuccessAsync(tx);
};
