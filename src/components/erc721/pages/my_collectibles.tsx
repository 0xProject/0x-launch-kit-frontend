import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { MyCollectiblesListContainer } from '../collectibles/my_collectibles_list';

export const MyCollectibles = () => (
    <>
        <MyCollectiblesListContainer />
        <CheckMetamaskStateModalContainer />
    </>
);
