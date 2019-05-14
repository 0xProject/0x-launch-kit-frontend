import { assetDataUtils, AssetProxyId, BigNumber } from '0x.js';
import { HttpClient, SignedOrder } from '@0x/connect';

import { RELAYER_URL } from '../common/constants';
import { Token } from '../util/types';

export class Relayer {
    public readonly client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public async getAllOrdersAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
        ]);

        return [...sellOrders, ...buyOrders];
    }

    public async getUserOrdersAsync(
        account: string,
        baseTokenAssetData: string,
        quoteTokenAssetData: string,
    ): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData, account),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData, account),
        ]);

        return [...sellOrders, ...buyOrders];
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

    public async getSellCollectibleOrdersAsync(
        collectibleAddress: string,
        wethAddress: string,
    ): Promise<SignedOrder[]> {
        const result = await this.client.getOrdersAsync({
            makerAssetProxyId: AssetProxyId.ERC721,
            takerAssetProxyId: AssetProxyId.ERC20,
            makerAssetAddress: collectibleAddress,
            takerAssetAddress: wethAddress,
        });

        return result.records.map(record => record.order);
    }

    private async _getOrdersAsync(
        makerAssetData: string,
        takerAssetData: string,
        makerAddress?: string,
    ): Promise<SignedOrder[]> {
        let recordsToReturn: SignedOrder[] = [];
        const requestOpts = {
            makerAssetData,
            takerAssetData,
            makerAddress,
        };

        let hasMorePages = true;
        let page = 1;

        while (hasMorePages) {
            const { total, records, perPage } = await this.client.getOrdersAsync({
                ...requestOpts,
                page,
            });

            const recordsMapped = records.map(apiOrder => {
                return apiOrder.order;
            });
            recordsToReturn = [...recordsToReturn, ...recordsMapped];

            page += 1;
            const lastPage = Math.ceil(total / perPage);
            hasMorePages = page <= lastPage;
        }
        return recordsToReturn;
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
