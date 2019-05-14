import { COLLECTIBLE_CONTRACT_ADDRESSES } from '../../common/constants';
import { Collectible, CollectibleMetadataSource } from '../../util/types';

export class Opensea implements CollectibleMetadataSource {
    private readonly _endpointsUrls: { [key: number]: string } = {
        1: 'https://api.opensea.io/api/v1',
        4: 'https://rinkeby-api.opensea.io/api/v1',
    };

    public static getAssetsAsCollectible(assets: any[]): Collectible[] {
        return assets.map((asset: any) => {
            return Opensea.getAssetAsCollectible(asset);
        });
    }

    public static getAssetAsCollectible(asset: any): Collectible {
        return {
            tokenId: asset.token_id,
            name: asset.name,
            color: `#${asset.background_color}`,
            image: asset.image_url,
            currentOwner: asset.owner.address,
            assetUrl: asset.external_link,
            description: asset.name,
            order: null,
        };
    }

    public async fetchAllUserCollectiblesAsync(userAddress: string, networkId: number): Promise<Collectible[]> {
        if (!networkId) {
            return Promise.resolve([]);
        }
        const metadataSourceUrl = this._endpointsUrls[networkId];
        const contractAddress = COLLECTIBLE_CONTRACT_ADDRESSES[networkId];
        const url = `${metadataSourceUrl}/assets?asset_contract_address=${contractAddress}&owner=${userAddress}`;
        const assetsResponse = await fetch(url);
        const assetsResponseJson = await assetsResponse.json();
        return Opensea.getAssetsAsCollectible(assetsResponseJson.assets);
    }

    public async fetchIndividualCollectibleAsync(tokenId: string, networkId: number): Promise<Collectible | null> {
        if (!networkId) {
            return Promise.resolve(null);
        }
        const metadataSourceUrl = this._endpointsUrls[networkId];
        const contractAddress = COLLECTIBLE_CONTRACT_ADDRESSES[networkId];
        const url = `${metadataSourceUrl}/assets?asset_contract_address=${contractAddress}&token_id=${tokenId}`;
        const assetsResponse = await fetch(url);
        const assetsResponseJson = await assetsResponse.json();
        return Opensea.getAssetAsCollectible(assetsResponseJson);
    }
}
