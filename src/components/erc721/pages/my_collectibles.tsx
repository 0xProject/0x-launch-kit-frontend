import React from 'react';

import { MyCollectiblesListContainer } from '../collectibles/collectibles_list';
import { Content } from '../common/content_wrapper';

export const MyCollectibles = () => (
    <Content>
        <MyCollectiblesListContainer title="My Collectibles" />
    </Content>
);
