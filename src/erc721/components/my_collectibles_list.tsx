import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getMyCollectibles } from '../../store/selectors';
import { Collectible, StoreState } from '../../util/types';
import { CollectibleAsset } from '../components/collectible_asset';

const CollectiblesListWrapper = styled.div``;

interface Props {
    myCollectibles: Collectible[];
}

export const MyCollectiblesList = (props: Props) => {
    const { myCollectibles } = props;
    return (
        <CollectiblesListWrapper>
            {myCollectibles.map((item, index) => {
                const { name, price, image, color } = item;
                return <CollectibleAsset name={name} price={price} image={image} color={color} key={index} />;
            })}
        </CollectiblesListWrapper>
    );
};

const mapStateToProps = (state: StoreState): Props => {
    return {
        myCollectibles: getMyCollectibles(state),
    };
};

export const MyCollectiblesListContainer = connect(mapStateToProps)(MyCollectiblesList);
