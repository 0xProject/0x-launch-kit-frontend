import { assetDataUtils, SignedOrder } from '0x.js';

import { COLLECTIBLE_ADDRESS } from '../common/constants';
import { getRelayer, Relayer } from '../services/relayer';
import { getKnownTokens } from '../util/known_tokens';
import { getLogger } from '../util/logger';
import { Collectible, CollectibleMetadataSource } from '../util/types';

import { getConfiguredSource } from './collectibles_metadata_sources';

const logger = getLogger('CollectiblesMetadataGateway');

export class CollectiblesMetadataGateway {
    private readonly _relayer: Relayer;
    private readonly _source: CollectibleMetadataSource;

    constructor(relayer: Relayer, source: CollectibleMetadataSource) {
        this._relayer = relayer;
        this._source = source;
    }

    public fetchAllCollectibles = async (userAddress?: string): Promise<Collectible[]> => {
        const knownTokens = getKnownTokens();

        const wethAddress = knownTokens.getWethToken().address;

        // Step 1: Get all sell orders in the relayer
        let orders: any[] = [];
        try {
            orders = await this._relayer.getSellCollectibleOrdersAsync(COLLECTIBLE_ADDRESS, wethAddress);
        } catch (err) {
            logger.error(err);
            throw err;
        }

        const tokenIdToOrder = orders.reduce<{ [tokenId: string]: SignedOrder }>((acc, order) => {
            const { tokenId } = assetDataUtils.decodeERC721AssetData(order.makerAssetData);
            acc[tokenId.toString()] = order;
            return acc;
        }, {});

        // Step 2: Get all the user's collectibles and add the order
        let collectiblesWithOrders: Collectible[] = [];
        if (userAddress) {
            const userCollectibles = await this._source.fetchAllUserCollectiblesAsync(userAddress);
            collectiblesWithOrders = userCollectibles.map(collectible => {
                if (tokenIdToOrder[collectible.tokenId]) {
                    return {
                        ...collectible,
                        order: tokenIdToOrder[collectible.tokenId],
                    };
                }

                return collectible;
            });
        }

        // Step 3: Get collectibles that are not from the user
        let collectiblesFetched: any[] = [];
        const tokenIds: string[] = Object.keys(tokenIdToOrder).filter(
            tokenId => !collectiblesWithOrders.find(collectible => collectible.tokenId === tokenId),
        );
        for (let chunkBegin = 0; chunkBegin < tokenIds.length; chunkBegin += 10) {
            const tokensIdsChunk = tokenIds.slice(chunkBegin, chunkBegin + 10);
            const collectiblesChunkFetched = await this._source.fetchCollectiblesAsync(tokensIdsChunk);
            const collectiblesChunkWithOrders = collectiblesChunkFetched.map(collectible => ({
                ...collectible,
                order: tokenIdToOrder[collectible.tokenId],
            }));
            collectiblesFetched = collectiblesFetched.concat(collectiblesChunkWithOrders);
        }

        collectiblesWithOrders.push(...collectiblesFetched);

        return collectiblesWithOrders;
    };
}

let collectiblesMetadataGateway: CollectiblesMetadataGateway;
export const getCollectiblesMetadataGateway = (): CollectiblesMetadataGateway => {
    if (!collectiblesMetadataGateway) {
        const relayer = getRelayer();
        const source = getConfiguredSource();
        collectiblesMetadataGateway = new CollectiblesMetadataGateway(relayer, source);
    }
    return collectiblesMetadataGateway;
};
