import { getErc721 } from './erc721';

export const fetchUserCollectibles = (): Promise<any> => {
    // @TODO: map data fetched from API (opensea/mocked) to UI Collectible type
    const erc721 = getErc721();
    return Promise.resolve(erc721.fetchUserCollectibles());
};
