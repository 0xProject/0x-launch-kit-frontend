import { Collectible } from '../../util/types';

import { loadGateway } from './collectibles_metadata_utils';

export class CollectiblesMetadataSource {
    public fetchUserCollectibles = async (ownerAddress: string, networkId: number | null): Promise<Collectible[]> => {
        const gateway = loadGateway();
        return gateway.fetchUserCollectiblesAsync(ownerAddress, networkId);
    };
}

let collectiblesMetadataSource: CollectiblesMetadataSource;
export const getCollectiblesMetadataSource = (): CollectiblesMetadataSource => {
    if (!collectiblesMetadataSource) {
        collectiblesMetadataSource = new CollectiblesMetadataSource();
    }
    return collectiblesMetadataSource;
};
