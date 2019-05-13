import { COLLECTIBLE_CONTRACT_ADDRESSES } from '../../common/constants';
import { Collectible, CollectibleMetadataSource } from '../../util/types';

export class Opensea implements CollectibleMetadataSource {
    private readonly _endpointsUrls: { [key: number]: string } = {
        1: 'https://api.opensea.io/api/v1',
        4: 'https://rinkeby-api.opensea.io/api/v1',
    };

    public static getAssetsAsCollectible(assets: any[], contractAddress: string): Collectible[] {
        return assets.map((asset: any) => {
            return {
                contractAddress,
                tokenId: asset.token_id,
                name: asset.name,
                price: null,
                color: `#${asset.background_color}`,
                image: asset.image_url,
                currentOwner: asset.owner.address,
                assetUrl: asset.external_link,
                description: asset.name,
            };
        });
    }

    public async fetchUserCollectiblesAsync(ownerAddress: string, networkId: number | null): Promise<Collectible[]> {
        if (!networkId) {
            return Promise.resolve([]);
        }
        const metadataSourceUrl = this._endpointsUrls[networkId];
        const contractAddress = COLLECTIBLE_CONTRACT_ADDRESSES[networkId];
        const url = `${metadataSourceUrl}/assets?asset_contract_address=${contractAddress}&owner=${ownerAddress}`;
        const assetsResponse = await fetch(url);
        const assetsResponseJson = await assetsResponse.json();
        return Opensea.getAssetsAsCollectible(assetsResponseJson.assets, contractAddress);
    }
}
