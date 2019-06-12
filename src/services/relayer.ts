import { assetDataUtils, AssetProxyId, BigNumber } from '0x.js';
import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { RateLimit } from 'async-sema';

import { RELAYER_URL } from '../common/constants';
import { tokenAmountInUnitsToBigNumber } from '../util/tokens';
import { Token } from '../util/types';

export class Relayer {
    private readonly _client: HttpClient;
    private readonly _rateLimit: () => Promise<void>;

    constructor(client: HttpClient, options: { rps: number }) {
        this._client = client;
        this._rateLimit = RateLimit(options.rps); // requests per second
    }

    public async getAllOrdersAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<SignedOrder[]> {
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
        ]);

        return [...sellOrders, ...buyOrders];
    }

    public async getOrderConfigAsync(orderConfig: OrderConfigRequest): Promise<OrderConfigResponse> {
        await this._rateLimit();
        return this._client.getOrderConfigAsync(orderConfig);
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
        await this._rateLimit();
        const { asks } = await this._client.getOrderbookAsync({
            baseAssetData: assetDataUtils.encodeERC20AssetData(baseToken.address),
            quoteAssetData: assetDataUtils.encodeERC20AssetData(quoteToken.address),
        });

        if (asks.records.length) {
            const lowestPriceAsk = asks.records[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk.order;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            return takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        return null;
    }

    public async getSellCollectibleOrdersAsync(
        collectibleAddress: string,
        wethAddress: string,
    ): Promise<SignedOrder[]> {
        await this._rateLimit();
        const result = await this._client.getOrdersAsync({
            makerAssetProxyId: AssetProxyId.ERC721,
            takerAssetProxyId: AssetProxyId.ERC20,
            makerAssetAddress: collectibleAddress,
            takerAssetAddress: wethAddress,
        });

        return result.records.map(record => record.order);
    }

    public async submitOrderAsync(order: SignedOrder): Promise<void> {
        await this._rateLimit();
        return this._client.submitOrderAsync(order);
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
            await this._rateLimit();
            const { total, records, perPage } = await this._client.getOrdersAsync({
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
        relayer = new Relayer(client, { rps: 5 });
    }

    return relayer;
};
