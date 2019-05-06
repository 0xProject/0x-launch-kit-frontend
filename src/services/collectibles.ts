import { getErc721 } from './erc721';

export const getMyCollectibles = () => {
    const erc721 = getErc721();
    return erc721.getMyCollectibles();
};
