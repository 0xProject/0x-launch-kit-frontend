import { Collectible } from '../../../util/types';

export interface GatewayClass {
    fetchUserCollectiblesAsync(ownerAddress: string, networkId: number | null): Promise<Collectible[]>;
}
