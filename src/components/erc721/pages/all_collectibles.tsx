import React from 'react';

import { COLLECTIBLE_DESCRIPTION, COLLECTIBLE_NAME } from '../../../common/constants';
import { AllCollectiblesContainer } from '../collectibles/collectibles_all';

export const AllCollectibles = () => (
    <AllCollectiblesContainer title={COLLECTIBLE_NAME} description={COLLECTIBLE_DESCRIPTION} />
);
