import { assetDataUtils, BigNumber } from '0x.js';
import { HttpClient, SignedOrder } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';
import { Token } from '../util/types';

export class Relayer {
    public readonly client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async getAllOrdersAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<SignedOrder[]> {
        const sellOrders = await this.client
            .getOrdersAsync({
                makerAssetData: baseTokenAssetData,
                takerAssetData: quoteTokenAssetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const buyOrders = await this.client
            .getOrdersAsync({
                makerAssetData: quoteTokenAssetData,
                takerAssetData: baseTokenAssetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));

        return [...sellOrders, ...buyOrders];
    }

    public async getUserOrdersAsync(
        account: string,
        baseTokenAssetData: string,
        quoteTokenAssetData: string,
    ): Promise<SignedOrder[]> {
        const userSellOrders = await this.client
            .getOrdersAsync({
                makerAddress: account,
                makerAssetData: baseTokenAssetData,
                takerAssetData: quoteTokenAssetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const userBuyOrders = await this.client
            .getOrdersAsync({
                makerAddress: account,
                makerAssetData: quoteTokenAssetData,
                takerAssetData: baseTokenAssetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));

        return [...userSellOrders, ...userBuyOrders];
    }

    public async getCurrencyPairPriceAsync(baseToken: Token, quoteToken: Token): Promise<BigNumber | null> {
        const { asks } = await this.client.getOrderbookAsync({
            baseAssetData: assetDataUtils.encodeERC20AssetData(baseToken.address),
            quoteAssetData: assetDataUtils.encodeERC20AssetData(quoteToken.address),
        });

        if (asks.records.length) {
            const lowestPriceAsk = asks.records[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk.order;

            return takerAssetAmount.div(makerAssetAmount);
        }

        return null;
    }
}

let relayer: Relayer;
export const getRelayer = (): Relayer => {
    if (!relayer) {
        const client = new HttpClient(RELAYER_URL);
        relayer = new Relayer(client);
    }

    return relayer;
};
