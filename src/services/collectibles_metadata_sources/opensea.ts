import { COLLECTIBLE_ADDRESS, OPENSEA_API_KEY } from '../../common/constants';
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
            name: asset.name || `${asset.asset_contract.name} - #${asset.token_id}`,
            color: asset.background_color ? `#${asset.background_color}` : '',
            image: asset.image_url,
            currentOwner: asset.owner.address,
            assetUrl: asset.external_link,
            description: asset.name,
            order: null,
        };
    }

    public async fetchAllUserCollectiblesAsync(userAddress: string, networkId: number): Promise<Collectible[]> {
        const metadataSourceUrl = this._endpointsUrls[networkId];
        const contractAddress = COLLECTIBLE_ADDRESS;
        const url = `${metadataSourceUrl}/assets?asset_contract_address=${contractAddress}&owner=${userAddress}`;
        const assetsResponse = await this._fetch(url);
        const assetsResponseJson = await assetsResponse.json();
        return Opensea.getAssetsAsCollectible(assetsResponseJson.assets);
    }

    public async fetchIndividualCollectibleAsync(tokenId: string, networkId: number): Promise<Collectible | null> {
        const metadataSourceUrl = this._endpointsUrls[networkId];
        const contractAddress = COLLECTIBLE_ADDRESS;
        const url = `${metadataSourceUrl}/asset/${contractAddress}/${tokenId}`;
        const assetsResponse = await this._fetch(url);
        const assetsResponseJson = await assetsResponse.json();
        return Opensea.getAssetAsCollectible(assetsResponseJson);
    }

    private readonly _fetch = async (url: string) => {
        return fetch(url, {
            headers: { 'X-API-KEY': OPENSEA_API_KEY || '' } as any,
        });
    };
}
