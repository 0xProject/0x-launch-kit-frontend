import { assetDataUtils, AssetProxyId, BigNumber } from '0x.js';
import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { RateLimit } from 'async-sema';

import { RELAYER_URL, RELAYER_WS_URL } from '../common/constants';
import { getLogger } from '../util/logger';
import { serializeOrder } from '../util/orders';
import { tokenAmountInUnitsToBigNumber } from '../util/tokens';
import {
    AccountMarketStat,
    MarketData,
    PaginatedRelayerCollection,
    RelayerFill,
    RelayerMarketStats,
    Token,
} from '../util/types';
// tslint:disable-next-line
const uuidv1 = require('uuid/v1');
const logger = getLogger('Services::Relayer');
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

    public async getCurrencyPairMarketDataAsync(baseToken: Token, quoteToken: Token): Promise<MarketData> {
        await this._rateLimit();
        const { asks, bids } = await this._client.getOrderbookAsync({
            baseAssetData: assetDataUtils.encodeERC20AssetData(baseToken.address),
            quoteAssetData: assetDataUtils.encodeERC20AssetData(quoteToken.address),
        });
        const marketData: MarketData = {
            bestAsk: null,
            bestBid: null,
            spreadInPercentage: null,
        };

        if (asks.records.length) {
            const lowestPriceAsk = asks.records[0];
            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk.order;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            marketData.bestAsk = takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        if (bids.records.length) {
            const lowestPriceBid = bids.records[0];
            const { makerAssetAmount, takerAssetAmount } = lowestPriceBid.order;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, baseToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, quoteToken.decimals);
            marketData.bestBid = makerAssetAmountInUnits.div(takerAssetAmountInUnits);
        }
        if (marketData.bestAsk && marketData.bestBid) {
            const spread = marketData.bestAsk.minus(marketData.bestBid).dividedBy(marketData.bestAsk);
            marketData.spreadInPercentage = spread.multipliedBy(100);
        }

        return marketData;
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

export const getMarketFillsFromRelayer = async (
    pair: string,
    page: number = 0,
    perPage: number = 100,
): Promise<PaginatedRelayerCollection<RelayerFill[]> | null> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    // Get only last 100 trades
    const response = await fetch(
        `${RELAYER_URL}/markets/${pair}/history?page=${page}&perPage=${(page + 1) * perPage}`,
        init,
    );
    if (response.ok) {
        return (await response.json()) as PaginatedRelayerCollection<RelayerFill[]>;
    } else {
        return null;
    }
};

export const getFillsFromRelayer = async (
    page: number = 0,
    perPage: number = 100,
): Promise<PaginatedRelayerCollection<RelayerFill[]> | null> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    // Get only last 100 trades
    const response = await fetch(`${RELAYER_URL}/markets/history?page=${page}&perPage=${(page + 1) * perPage}`, init);
    if (response.ok) {
        return (await response.json()) as PaginatedRelayerCollection<RelayerFill[]>;
    } else {
        return null;
    }
};

export const getMarketStatsFromRelayer = async (pair: string): Promise<RelayerMarketStats | null> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    // Get only last 100 trades
    const response = await fetch(`${RELAYER_URL}/markets/stats/${pair}`, init);
    if (response.ok) {
        return (await response.json()) as RelayerMarketStats;
    } else {
        return null;
    }
};

export const getAccountMarketStatsFromRelayer = async (
    pair: string,
    from: number,
    to: number,
): Promise<AccountMarketStat[]> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    const response = await fetch(`${RELAYER_URL}/markets/${pair}/accounts/stats?from=${from}&to=${to}`, init);
    if (response.ok) {
        return (await response.json()) as AccountMarketStat[];
    } else {
        return [];
    }
};

export const postIEOSignedOrder = async (order: SignedOrder): Promise<void> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });

    const init: RequestInit = {
        method: 'POST',
        headers,
        body: JSON.stringify(order),
    };
    const response = await fetch(`${RELAYER_URL}/ieo_order`, init);
    if (response.ok) {
        return;
    }
};

export const getUserIEOSignedOrders = async (
    makerAddress: string,
    baseToken: Token,
    quoteToken: Token,
): Promise<SignedOrder[]> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    const baseAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
    const quoteAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);

    const response = await fetch(
        `${RELAYER_URL}/ieo_orders?makerAssetData=${baseAssetData}&takerAssetData=${quoteAssetData}&makerAddress=${makerAddress.toLowerCase()}`,
        init,
    );
    if (response.ok) {
        return (await response.json()).records.map((r: any) => r.order).map(serializeOrder) as SignedOrder[];
    } else {
        return [];
    }
};

export const getAllIEOSignedOrders = async (): Promise<SignedOrder[]> => {
    const headers = new Headers({
        'content-type': 'application/json',
    });
    const init: RequestInit = {
        method: 'GET',
        headers,
    };
    const response = await fetch(`${RELAYER_URL}/ieo_orders`, init);
    if (response.ok) {
        return (await response.json()).records.map((r: any) => r.order) as SignedOrder[];
    } else {
        return [];
    }
};

let relayerSocket: WebSocket | null;
export const getWebsocketRelayerConnection = () => {
    if (!relayerSocket) {
        relayerSocket = new WebSocket(RELAYER_WS_URL);
    }
    return relayerSocket;
};

export const startWebsocketMarketsSubscription = (cb_onmessage: any): WebSocket => {
    const socket = getWebsocketRelayerConnection();
    const uuid = uuidv1();
    const requestAll = {
        type: 'SUBSCRIBE',
        topic: 'BOOK',
        market: 'ALL_FILLS_OPTS',
        requestId: uuid,
    };
    socket.onopen = event => {
        socket.send(JSON.stringify(requestAll));
    };
    socket.onerror = event => {
        logger.error('Socket error. Reconnect will be attempted in 1 second.');
        setTimeout(() => {
            relayerSocket = null;
            startWebsocketMarketsSubscription(cb_onmessage);
        }, 1000);
    };

    socket.onclose = event => {
        logger.error('Socket is closed. Reconnect will be attempted in 1 second.');
        setTimeout(() => {
            relayerSocket = null;
            startWebsocketMarketsSubscription(cb_onmessage);
        }, 1000);
    };
    socket.onmessage = event => {
        cb_onmessage(event);
    };

    return socket;
};
