import React from 'react';
import { connect } from 'react-redux';

import { getAllCollectibles, getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';

interface Props {
    collectibles: { [key: string]: Collectible };
}

export const CollectiblesList = (props: Props) => {
    const collectibles = Object.keys(props.collectibles).map(key => props.collectibles[key]);
    return <CollectiblesCardList collectibles={collectibles} />;
};

const allMapStateToProps = (state: StoreState): Props => {
    return {
        collectibles: getAllCollectibles(state),
    };
};
export const AllCollectiblesListContainer = connect(allMapStateToProps)(CollectiblesList);

const myMapStateToProps = (state: StoreState): Props => {
    return {
        collectibles: getUserCollectibles(state),
    };
};
export const MyCollectiblesListContainer = connect(myMapStateToProps)(CollectiblesList);
