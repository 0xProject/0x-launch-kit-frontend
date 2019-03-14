import { HttpClient, SignedOrder } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';

export class Relayer {
    public readonly client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async getAllOrdersAsync(assetData: string): Promise<SignedOrder[]> {
        const sellOrders = await this.client
            .getOrdersAsync({
                makerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const buyOrders = await this.client
            .getOrdersAsync({
                takerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        return [...sellOrders, ...buyOrders];
    }

    public async getUserOrdersAsync(account: string, assetData: string): Promise<SignedOrder[]> {
        const userSellOrders = await this.client
            .getOrdersAsync({
                makerAddress: account,
                makerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const userBuyOrders = await this.client
            .getOrdersAsync({
                makerAddress: account,
                takerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));

        return [...userSellOrders, ...userBuyOrders];
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
