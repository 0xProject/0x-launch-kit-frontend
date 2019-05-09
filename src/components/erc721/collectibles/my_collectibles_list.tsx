import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectibleAssetContainer } from './collectible_details';

const CollectiblesListWrapper = styled.div``;

interface Props {
    userCollectibles: { [key: string]: Collectible };
}

export const MyCollectiblesList = (props: Props) => {
    const { userCollectibles } = props;
    const collectibles = Object.keys(userCollectibles).map(key => userCollectibles[key]);
    return (
        <CollectiblesListWrapper>
            {collectibles.map((item, index) => {
                const { name, price, image, color, tokenId } = item;
                return (
                    <CollectibleAssetContainer
                        name={name}
                        price={price}
                        image={image}
                        color={color}
                        id={tokenId}
                        key={index}
                    />
                );
            })}
        </CollectiblesListWrapper>
    );
};

const mapStateToProps = (state: StoreState): Props => {
    return {
        userCollectibles: getUserCollectibles(state),
    };
};

export const MyCollectiblesListContainer = connect(mapStateToProps)(MyCollectiblesList);
