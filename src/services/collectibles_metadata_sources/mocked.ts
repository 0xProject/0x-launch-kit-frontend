import { BigNumber } from '0x.js';

import { COLLECTIBLE_ADDRESS } from '../../common/constants';
import { getContractWrappers } from '../../services/contract_wrappers';
import { Collectible, CollectibleMetadataSource } from '../../util/types';

const allCollectibles: Collectible[] = [
    {
        tokenId: '0',
        name: 'Glitter',
        order: null,
        color: '#F6FEFC',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '1',
        name: 'Furbeard',
        order: null,
        color: '#F6C68A',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/9_xunbhn.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '2',
        name: 'Glasswalker',
        order: null,
        color: '#CAFAF7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888668/10_iqm4un.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '3',
        name: 'Ande',
        order: null,
        color: '#B8F1B9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888667/5_sxqrol.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '4',
        name: 'Squib',
        order: null,
        color: '#CFD4F9',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888664/1_sz6sji.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '10',
        name: 'Negato',
        order: null,
        color: '#D7BBF3',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888661/8_qjebni.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '11',
        name: 'DuCat',
        order: null,
        color: '#D6DDD8',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888654/2_yndavu.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
    {
        tokenId: '12',
        name: 'Berry',
        order: null,
        color: '#F7B4D5',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888653/4_do9hzd.png',
        assetUrl: 'https://www.cryptokitties.co/',
        description: '',
        currentOwner: '',
    },
];

export class Mocked implements CollectibleMetadataSource {
    public fetchAllUserCollectiblesAsync = async (userAddress: string): Promise<Collectible[]> => {
        const contractAddress = COLLECTIBLE_ADDRESS;
        const contractWrappers = await getContractWrappers();

        const allCollectiblesWithOwner = await Promise.all(
            allCollectibles.map(async collectible => {
                const owner = await contractWrappers.erc721Token.getOwnerOfAsync(
                    contractAddress,
                    new BigNumber(collectible.tokenId),
                );

                return {
                    ...collectible,
                    currentOwner: owner,
                };
            }),
        );

        return allCollectiblesWithOwner;
    };

    public fetchCollectiblesAsync = (tokenIds: string[]): Promise<Collectible[]> => {
        const collectibles = allCollectibles.filter(value => tokenIds.indexOf(value.tokenId) !== -1);
        return Promise.resolve(collectibles);
    };
}
