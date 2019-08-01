import { assetDataUtils, AssetProxyId, BigNumber } from '0x.js';
import {
    APIOrder,
    HttpClient,
    OrderConfigRequest,
    OrderConfigResponse,
    OrdersChannel,
    ordersChannelFactory,
    OrdersChannelHandler,
    SignedOrder,
} from '@0x/connect';
import { orderHashUtils } from '@0x/order-utils';
import { RateLimit } from 'async-sema';

import { RELAYER_URL, RELAYER_WEBSOCKET_URL } from '../common/constants';
import { tokenAmountInUnitsToBigNumber } from '../util/tokens';
import { Token } from '../util/types';

export class Relayer {
    private readonly _client: HttpClient;
    private readonly _rateLimit: () => Promise<void>;
    private readonly _orders: Map<string, SignedOrder> = new Map(); // key -> orderHash
    private readonly _keyToOrderHashes: Map<string, Set<string>> = new Map(); // key -> orderHash
    private readonly _subscriptions: Map<string, boolean> = new Map();
    private readonly _websocketUrl?: string;
    private _ordersChannel?: OrdersChannel;
    private static _key(baseTokenAssetData: string, quoteAssetData: string): string {
        const assetDataKey = [baseTokenAssetData, quoteAssetData].sort().join('-');
        return assetDataKey;
    }
    private static _getOrderHash(order: APIOrder | SignedOrder): string {
        if ((order as APIOrder).metaData) {
            const apiOrder = order as APIOrder;
            const orderHash = (apiOrder.metaData as any).orderHash || orderHashUtils.getOrderHashHex(apiOrder.order);
            return orderHash;
        } else {
            const orderHash = orderHashUtils.getOrderHashHex(order as SignedOrder);
            return orderHash;
        }
    }

    constructor(url: string, options: { rps: number; websocketUrl?: string }) {
        this._client = new HttpClient(url);
        this._rateLimit = RateLimit(options.rps); // requests per second
        this._websocketUrl = options.websocketUrl;
    }
    public async getAllOrdersAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<SignedOrder[]> {
        const ordersKey = Relayer._key(baseTokenAssetData, quoteTokenAssetData);
        if (!this._subscriptions.has(ordersKey)) {
            // first time we have had this request
            await this._fetchOrdersAndSubscribeAsync(baseTokenAssetData, quoteTokenAssetData);
        }
        const orders: SignedOrder[] = [];
        const orderHashes = this._keyToOrderHashes.get(ordersKey);
        if (orderHashes) {
            orderHashes.forEach(orderHash => {
                const order = this._orders.get(orderHash);
                if (order) {
                    orders.push(order);
                }
            });
        }
        return orders;
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
        const orders = await this.getAllOrdersAsync(baseTokenAssetData, quoteTokenAssetData);
        const filteredOrders = orders.filter(o => o.makerAddress === account.toLowerCase());
        return filteredOrders;
    }

    public async getCurrencyPairPriceAsync(baseToken: Token, quoteToken: Token): Promise<BigNumber | null> {
        await this._rateLimit();
        const baseAssetData = assetDataUtils.encodeERC20AssetData(baseToken.address);
        const quoteAssetData = assetDataUtils.encodeERC20AssetData(quoteToken.address);
        const allOrders = await this.getAllOrdersAsync(baseAssetData, quoteAssetData);
        const asks = allOrders
            .filter(o => {
                return o.makerAssetData === baseAssetData && o.takerAssetData === quoteAssetData;
            })
            .sort((a, b) =>
                a.makerAssetAmount.div(a.takerAssetAmount).comparedTo(b.makerAssetAmount.div(b.takerAssetAmount)),
            );

        if (asks.length > 0) {
            const lowestPriceAsk = asks[0];

            const { makerAssetAmount, takerAssetAmount } = lowestPriceAsk;
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
    public async _fetchOrdersAndSubscribeAsync(baseTokenAssetData: string, quoteTokenAssetData: string): Promise<void> {
        // first time we have had this request
        const ordersKey = Relayer._key(baseTokenAssetData, quoteTokenAssetData);
        const orderHashes = new Set<string>();
        this._keyToOrderHashes.set(ordersKey, orderHashes);
        const [sellOrders, buyOrders] = await Promise.all([
            this._getOrdersAsync(baseTokenAssetData, quoteTokenAssetData),
            this._getOrdersAsync(quoteTokenAssetData, baseTokenAssetData),
        ]);
        sellOrders.forEach(o => {
            const orderHash = Relayer._getOrderHash(o);
            this._orders.set(orderHash, o.order);
            orderHashes.add(orderHash);
        });
        buyOrders.forEach(o => {
            const orderHash = Relayer._getOrderHash(o);
            this._orders.set(orderHash, o.order);
            orderHashes.add(orderHash);
        });
        await this._createSubscriptionIfRequiredAsync(baseTokenAssetData, quoteTokenAssetData);
    }

    private async _getOrdersAsync(
        makerAssetData: string,
        takerAssetData: string,
        makerAddress?: string,
    ): Promise<Set<APIOrder>> {
        const recordsToReturn: Set<APIOrder> = new Set<APIOrder>();
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
            records.forEach(o => recordsToReturn.add(o));

            page += 1;
            const lastPage = Math.ceil(total / perPage);
            hasMorePages = page <= lastPage;
        }
        return recordsToReturn;
    }
    private _ordersReceived(orders: APIOrder[]): void {
        for (const order of orders) {
            const orderKey = Relayer._key(order.order.makerAssetData, order.order.takerAssetData);
            const storedOrdersHashes = this._keyToOrderHashes.get(orderKey);
            if (storedOrdersHashes) {
                const remainingFillableTakerAssetAmount = (order.metaData as any).remainingFillableTakerAssetAmount;
                const orderHash = Relayer._getOrderHash(order);
                // If we have the meta data informing us that the order cannot be filled for any amount we don't add it
                if (remainingFillableTakerAssetAmount && new BigNumber(remainingFillableTakerAssetAmount).eq(0)) {
                    storedOrdersHashes.delete(orderHash);
                    this._orders.delete(orderHash);
                } else {
                    if (!this._orders.has(orderHash)) {
                        this._orders.set(orderHash, order.order);
                    }
                    if (!storedOrdersHashes.has(orderHash)) {
                        storedOrdersHashes.add(orderHash);
                    }
                }
            }
        }
    }
    private async _createSubscriptionIfRequiredAsync(
        baseTokenAssetData: string,
        quoteTokenAssetData: string,
    ): Promise<void> {
        if (!this._websocketUrl) {
            return;
        }
        if (!this._ordersChannel) {
            this._ordersChannel = await this._createOrdersChannelAsync();
        }
        const ordersKey = Relayer._key(baseTokenAssetData, quoteTokenAssetData);
        if (!this._subscriptions.has(ordersKey)) {
            this._ordersChannel.subscribe({
                baseAssetData: baseTokenAssetData,
                quoteAssetData: quoteTokenAssetData,
                limit: 100,
            });
            // No need for a second subscription as this contains updates on both pairs
            this._subscriptions.set(ordersKey, true);
        }
    }
    private async _createOrdersChannelAsync(): Promise<OrdersChannel> {
        if (!this._websocketUrl) {
            throw new Error('Cannot create OrdersChannel without Websocket URL');
        }
        const ordersChannelHandler: OrdersChannelHandler = {
            onUpdate: async (_channel, _opts, apiOrders) => {
                this._ordersReceived(apiOrders);
            },
            // tslint:disable-next-line:no-empty
            onError: (_channel, err) => {},
            onClose: async () => {
                this._ordersChannel = undefined;
                this._subscriptions.clear();
            },
        };
        return ordersChannelFactory.createWebSocketOrdersChannelAsync(this._websocketUrl, ordersChannelHandler);
    }
}

let relayer: Relayer;
export const getRelayer = (): Relayer => {
    if (!relayer) {
        relayer = new Relayer(RELAYER_URL, { rps: 5, websocketUrl: RELAYER_WEBSOCKET_URL });
    }
    return relayer;
};
