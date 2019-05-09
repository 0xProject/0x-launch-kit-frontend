import { Collectible } from '../util/types';

// @TODO: abstract the source of collectibles data (opensea/mocked)
// const allCollectibles: Collectible[] = [
//     {
//         tokenId: '1',
//         name: 'Glitter',
//         price: '2.30',
//         color: '#F6FEFC',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
//     },
//     {
//         tokenId: '2',
//         name: 'Furbeard',
//         price: '1.22',
//         color: '#F6C68A',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
//     },
//     {
//         tokenId: '3',
//         name: 'Glasswalker',
//         price: '3.41',
//         color: '#CAFAF7',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
//     },
//     {
//         tokenId: '4',
//         name: 'Ande',
//         price: '4.40',
//         color: '#B8F1B9',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
//     },
//     {
//         tokenId: '5',
//         name: 'Squib',
//         price: '10.30',
//         color: '#CFD4F9',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
//     },
//     {
//         tokenId: '6',
//         name: 'Negato',
//         price: '11.30',
//         color: '#D7BBF3',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
//     },
//     {
//         tokenId: '7',
//         name: 'DuCat',
//         price: '12.90',
//         color: '#D6DDD8',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
//     },
//     {
//         tokenId: '8',
//         name: 'Berry',
//         price: '2.30',
//         color: '#F7B4D5',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
//     },
//     {
//         tokenId: '9',
//         name: 'Vernon',
//         price: '9.30',
//         color: '#EADDDD',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/7_n9ro9n.png',
//     },
//     {
//         tokenId: '10',
//         name: 'Lee',
//         price: '7.80',
//         color: '#B8B2B3',
//         image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/3_mpghqd.png',
//     },
// ];

const collectibleConstants = {
    1: {
        contractAddress: `0x...`,
        metadataSourceUrl: `https://rinkeby-api.opensea.io/api/v1`,
    },
    4: {
        contractAddress: `0x16baf0de678e52367adc69fd067e5edd1d33e3bf`,
        metadataSourceUrl: `https://rinkeby-api.opensea.io/api/v1`,
    },
    42: {
        contractAddress: `0x...`,
        metadataSourceUrl: `https://rinkeby-api.opensea.io/api/v1`,
    },
    50: {
        contractAddress: `0x...`,
        metadataSourceUrl: `https://rinkeby-api.opensea.io/api/v1`,
    },
};

const getAssetsAsCollectible = (assets: any[]): Collectible[] => {
    return assets.map((asset: any) => {
        return {
            tokenId: asset.token_id,
            name: asset.name,
            price: '',
            color: `#${asset.background_color}`,
            image: asset.image_url,
        };
    });
};

export class CollectiblesMetadataSource {
    public fetchUserCollectibles = async (ownerAddress: string): Promise<any> => {
        const { metadataSourceUrl, contractAddress } = collectibleConstants[4];
        const url = `${metadataSourceUrl}/assets?asset_contract_address=${contractAddress}&owner=${ownerAddress}`;
        const assetsResponse = await fetch(url);
        const assetsJson = await assetsResponse.json();
        return getAssetsAsCollectible(assetsJson.assets);
    };
}

let collectiblesMetadataSource: CollectiblesMetadataSource;
export const getCollectiblesMetadataSource = (): CollectiblesMetadataSource => {
    if (!collectiblesMetadataSource) {
        collectiblesMetadataSource = new CollectiblesMetadataSource();
    }
    return collectiblesMetadataSource;
};
