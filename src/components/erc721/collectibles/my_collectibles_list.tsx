import React from 'react';
import { connect } from 'react-redux';

import { getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';

interface Props {
    userCollectibles: { [key: string]: Collectible };
}

export const MyCollectiblesList = (props: Props) => {
    const { userCollectibles } = props;
    const collectibles = Object.keys(userCollectibles).map(key => userCollectibles[key]);
    return <CollectiblesCardList collectibles={collectibles} />;
};

const mapStateToProps = (state: StoreState): Props => {
    return {
        userCollectibles: getUserCollectibles(state),
    };
};

export const MyCollectiblesListContainer = connect(mapStateToProps)(MyCollectiblesList);
