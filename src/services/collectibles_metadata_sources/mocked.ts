import { BigNumber } from '0x.js';

import { Collectible, CollectibleMetadataSource } from '../../util/types';

const allCollectibles: any[] = [
    {
        tokenId: '0',
        name: 'Glitter',
        price: new BigNumber('2.30'),
        color: '#F6FEFC',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0xAEC3C8eD9516A206a4fD47EC77f026EDD533CF17',
    },
    {
        tokenId: '1',
        name: 'Furbeard',
        price: null,
        color: '#F6C68A',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0xAEC3C8eD9516A206a4fD47EC77f026EDD533CF17',
    },
    {
        tokenId: '2',
        name: 'Glasswalker',
        price: new BigNumber('3.41'),
        color: '#CAFAF7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0xAEC3C8eD9516A206a4fD47EC77f026EDD533CF17',
    },
    {
        tokenId: '3',
        name: 'Ande',
        price: null,
        color: '#B8F1B9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0xAEC3C8eD9516A206a4fD47EC77f026EDD533CF17',
    },
    {
        tokenId: '4',
        name: 'Squib',
        price: null,
        color: '#CFD4F9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0xAEC3C8eD9516A206a4fD47EC77f026EDD533CF17',
    },
    {
        tokenId: '10',
        name: 'Negato',
        price: null,
        color: '#D7BBF3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
    },
    {
        tokenId: '11',
        name: 'DuCat',
        price: new BigNumber('12.90'),
        color: '#D6DDD8',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
    },
    {
        tokenId: '12',
        name: 'Berry',
        price: new BigNumber('2.30'),
        color: '#F7B4D5',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
    },
];

export class Mocked implements CollectibleMetadataSource {
    public fetchUserCollectiblesAsync = (address: string, networkId: number | null): Promise<Collectible[]> => {
        const userCollectibles = allCollectibles.filter(x => x.currentOwner.toLowerCase() === address.toLowerCase());
        return Promise.resolve(userCollectibles);
    };

    public fetchAllCollectiblesAsync = (networkId: number | null): Promise<Collectible[]> => {
        return Promise.resolve(allCollectibles);
    };
}
