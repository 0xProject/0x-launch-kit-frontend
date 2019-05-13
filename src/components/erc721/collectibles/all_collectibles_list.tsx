import React from 'react';
import { connect } from 'react-redux';

import { getAllCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';

interface Props {
    allCollectibles: { [key: string]: Collectible };
}

export const AllCollectiblesList = (props: Props) => {
    const { allCollectibles } = props;
    const collectibles = Object.keys(allCollectibles).map(key => allCollectibles[key]);
    return <CollectiblesCardList collectibles={collectibles} />;
};

const mapStateToProps = (state: StoreState): Props => {
    return {
        allCollectibles: getAllCollectibles(state),
    };
};

export const AllCollectiblesListContainer = connect(mapStateToProps)(AllCollectiblesList);
