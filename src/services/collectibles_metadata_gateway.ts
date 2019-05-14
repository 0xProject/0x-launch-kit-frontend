import { assetDataUtils, SignedOrder } from '0x.js';

import { COLLECTIBLE_CONTRACT_ADDRESSES } from '../common/constants';
import { getRelayer, Relayer } from '../services/relayer';
import { getKnownTokens } from '../util/known_tokens';
import { Collectible, CollectibleMetadataSource } from '../util/types';

import { getConfiguredSource } from './collectibles_metadata_sources';

export class CollectiblesMetadataGateway {
    private readonly _relayer: Relayer;

    constructor(relayer: Relayer) {
        this._relayer = relayer;
    }

    public fetchAllCollectibles = async (userAddress: string, networkId: number): Promise<Collectible[]> => {
        const source: CollectibleMetadataSource = getConfiguredSource();
        const collectibles = await source.fetchAllCollectiblesAsync(userAddress, networkId);

        const knownTokens = getKnownTokens(networkId);

        const collectibleAddress = COLLECTIBLE_CONTRACT_ADDRESSES[networkId];
        const wethAddress = knownTokens.getWethToken().address;

        const orders = await this._relayer.getSellCollectibleOrdersAsync(collectibleAddress, wethAddress);

        const tokenIdToOrder = orders.reduce<{ [tokenId: string]: SignedOrder }>((acc, order) => {
            const { tokenId } = assetDataUtils.decodeERC721AssetData(order.makerAssetData);
            acc[tokenId.toString()] = order;
            return acc;
        }, {});

        const collectiblesWithOrders = collectibles.map(collectible => {
            if (tokenIdToOrder[collectible.tokenId]) {
                return {
                    ...collectible,
                    order: tokenIdToOrder[collectible.tokenId],
                };
            }

            return collectible;
        });

        return collectiblesWithOrders;
    };
}

let collectiblesMetadataGateway: CollectiblesMetadataGateway;
export const getCollectiblesMetadataGateway = (): CollectiblesMetadataGateway => {
    if (!collectiblesMetadataGateway) {
        const relayer = getRelayer();
        collectiblesMetadataGateway = new CollectiblesMetadataGateway(relayer);
    }
    return collectiblesMetadataGateway;
};
