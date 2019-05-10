import { COLLECTIBLES_SOURCE } from '../../common/constants';
import { CollectibleMetadataSource } from '../../util/types';

import { OpenSea } from './opensea';

const sources: { [key: string]: CollectibleMetadataSource } = {
    opensea: new OpenSea(),
};

export const getConfiguredSource = () => {
    return sources[COLLECTIBLES_SOURCE.toLowerCase()];
};
