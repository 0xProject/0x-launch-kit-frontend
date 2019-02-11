import { HttpClient, SignedOrder } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';

export class Relayer {
    private readonly _client: HttpClient;

    constructor(client: HttpClient) {
        this._client = client;
    }

    public async getAllOrdersAsync(assetData: string): Promise<SignedOrder[]> {
        const sellOrders = await this._client
            .getOrdersAsync({
                makerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const buyOrders = await this._client
            .getOrdersAsync({
                takerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));

        return [...sellOrders, ...buyOrders];
    }

    public async getUserOrdersAsync(account: string, assetData: string): Promise<SignedOrder[]> {
        const userSellOrders = await this._client
            .getOrdersAsync({
                makerAddress: account,
                makerAssetData: assetData,
            })
            .then(page => page.records)
            .then(apiOrders => apiOrders.map(apiOrder => apiOrder.order));
        const userBuyOrders = await this._client
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
