import React from 'react';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { MyCollectiblesListContainer } from '../components/my_collectibles_list';

export const MyCollectibles = () => (
    <>
        <MyCollectiblesListContainer />
        <CheckMetamaskStateModalContainer />
    </>
);
