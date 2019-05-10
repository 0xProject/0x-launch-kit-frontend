import { Collectible } from '../util/types';

import { getConfiguredSource } from './collectibles_metadata_sources';

export class CollectiblesMetadataGateway {
    public fetchUserCollectibles = async (ownerAddress: string, networkId: number | null): Promise<Collectible[]> => {
        const source = getConfiguredSource();
        return source.fetchUserCollectiblesAsync(ownerAddress, networkId);
    };
}

let collectiblesMetadataGateway: CollectiblesMetadataGateway;
export const getCollectiblesMetadataGateway = (): CollectiblesMetadataGateway => {
    if (!collectiblesMetadataGateway) {
        collectiblesMetadataGateway = new CollectiblesMetadataGateway();
    }
    return collectiblesMetadataGateway;
};
