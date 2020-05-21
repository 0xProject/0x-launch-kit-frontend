import { COLLECTIBLES_SOURCE } from '../../common/constants';
import { CollectibleMetadataSource } from '../../util/types';

import { Mocked } from './mocked';
import { Opensea } from './opensea';

const sources: { [key: string]: CollectibleMetadataSource } = {
    opensea: new Opensea({ rps: 5 }),
    mocked: new Mocked(),
};

export const getConfiguredSource = () => {
    return sources[COLLECTIBLES_SOURCE.toLowerCase()];
};
