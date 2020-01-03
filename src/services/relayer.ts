import { HttpClient, OrderConfigRequest, OrderConfigResponse, SignedOrder } from '@0x/connect';
import { assetDataUtils, AssetProxyId } from '@0x/order-utils';
import { Orderbook } from '@0x/orderbook';
import { BigNumber } from '@0x/utils';
import { RateLimit } from 'async-sema';

import { RELAYER_RPS, RELAYER_URL, RELAYER_WS_URL } from '../common/constants';
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
    private readonly _orderbook: Orderbook;

    constructor(options: { rps: number }) {
        this._orderbook = Orderbook.getOrderbookForWebsocketProvider({
            httpEndpoint: RELAYER_URL,
            websocketEndpoint: RELAYER_WS_URL,
        });
        this._client = new HttpClient(RELAYER_URL);
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
        const asks = await this._getOrdersAsync(
            assetDataUtils.encodeERC20AssetData(baseToken.address),
            assetDataUtils.encodeERC20AssetData(quoteToken.address),
        );

        if (asks.length) {
            const lowestPriceAsk = asks[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            return takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        return null;
    }

    public async getCurrencyPairMarketDataAsync(baseToken: Token, quoteToken: Token): Promise<MarketData> {
        // await this._rateLimit();
        const baseTokenAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
        const quoteTokenAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
        const [asks, bids] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
        ]);

        const marketData: MarketData = {
            bestAsk: null,
            bestBid: null,
            spreadInPercentage: null,
        };

        if (asks.length) {
            const lowestPriceAsk = asks[0];
            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk;
            const takerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(takerAssetAmount, quoteToken.decimals);
            const makerAssetAmountInUnits = tokenAmountInUnitsToBigNumber(makerAssetAmount, baseToken.decimals);
            marketData.bestAsk = takerAssetAmountInUnits.div(makerAssetAmountInUnits);
        }

        if (bids.length) {
            const highestPriceBid = bids[bids.length - 1];
            const { makerAssetAmount, takerAssetAmount } = highestPriceBid;
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
        const apiOrders = await this._orderbook.getOrdersAsync(makerAssetData, takerAssetData);
        const orders = apiOrders.map(o => o.order);
        if (makerAddress) {
            return orders.filter(o => o.makerAddress === makerAddress);
        } else {
            return orders;
        }
    }
}

let relayer: Relayer;
export const getRelayer = (): Relayer => {
    if (!relayer) {
        relayer = new Relayer({ rps: RELAYER_RPS });
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
        }, 3000);
    };

    socket.onclose = event => {
        logger.error('Socket is closed. Reconnect will be attempted in 1 second.');
        setTimeout(() => {
            relayerSocket = null;
            startWebsocketMarketsSubscription(cb_onmessage);
        }, 3000);
    };
    socket.onmessage = event => {
        cb_onmessage(event);
    };

    return socket;
};
