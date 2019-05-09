import { Collectible } from '../util/types';

// @TODO: abstract the source of collectibles data (opensea/mocked)
const allCollectibles: Collectible[] = [
    {
        tokenId: '1',
        name: 'Glitter',
        price: '2.30',
        color: '#F6FEFC',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '2',
        name: 'Furbeard',
        price: '1.22',
        color: '#F6C68A',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '3',
        name: 'Glasswalker',
        price: '3.41',
        color: '#CAFAF7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '4',
        name: 'Ande',
        price: '4.40',
        color: '#B8F1B9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '5',
        name: 'Squib',
        price: '10.30',
        color: '#CFD4F9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '6',
        name: 'Negato',
        price: '11.30',
        color: '#D7BBF3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '7',
        name: 'DuCat',
        price: '12.90',
        color: '#D6DDD8',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '8',
        name: 'Berry',
        price: '2.30',
        color: '#F7B4D5',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '9',
        name: 'Vernon',
        price: '9.30',
        color: '#EADDDD',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/7_n9ro9n.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '10',
        name: 'Lee',
        price: '7.80',
        color: '#B8B2B3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888649/3_mpghqd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
];

export class CollectiblesMetadataSource {
    public fetchUserCollectibles = (): Promise<Collectible[]> => {
        return Promise.resolve(allCollectibles);
    };
}

let collectiblesMetadataSource: CollectiblesMetadataSource;
export const getCollectiblesMetadataSource = (): CollectiblesMetadataSource => {
    if (!collectiblesMetadataSource) {
        collectiblesMetadataSource = new CollectiblesMetadataSource();
    }
    return collectiblesMetadataSource;
};
