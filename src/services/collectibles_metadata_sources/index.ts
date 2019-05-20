import { COLLECTIBLE_CONTRACT_ADDRESSES, COLLECTIBLES_SOURCE } from '../../common/constants';
import { CollectibleMetadataSource } from '../../util/types';

import { Mocked } from './mocked';
import { Opensea } from './opensea';

const sources: { [key: string]: CollectibleMetadataSource } = {
    opensea: new Opensea(),
    mocked: new Mocked(),
};

export const getConfiguredSource = () => {
    return sources[COLLECTIBLES_SOURCE.toLowerCase()];
};

export const getCollectibleContractAddress = (networkId: number) => {
    return COLLECTIBLE_CONTRACT_ADDRESSES[networkId] ? COLLECTIBLE_CONTRACT_ADDRESSES[networkId] : '';
};
