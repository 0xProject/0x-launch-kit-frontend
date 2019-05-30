import React from 'react';

import { COLLECTIBLE_NAME } from '../../../common/constants';
import { AllCollectiblesListContainer } from '../collectibles/collectibles_list';
import { Content } from '../common/content_wrapper';

export const ListCollectibles = () => (
    <Content>
        <AllCollectiblesListContainer title={COLLECTIBLE_NAME} />
    </Content>
);
