import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { COLLECTIBLE_NAME, ERC721_APP_BASE_PATH } from '../../../common/constants';
import { getCurrentRoutePath, getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';

interface Props {
    collectibles: { [key: string]: Collectible };
    routePath: string;
}

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-basis: 100%;
`;

const FiltersMenu = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 48px;
`;

const Title = styled.div`
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
`;

export const CollectiblesList = (props: Props) => {
    const collectibles = Object.keys(props.collectibles).map(key => props.collectibles[key]);
    const title = props.routePath === `${ERC721_APP_BASE_PATH}/my-collectibles` ? 'My Collectibles' : COLLECTIBLE_NAME;
    return (
        <MainContainer>
            <FiltersMenu>
                <Title>{title}</Title>
            </FiltersMenu>
            <CollectiblesCardList collectibles={collectibles} />
        </MainContainer>
    );
};

const allMapStateToProps = (state: StoreState): Props => {
    return {
        collectibles: getOtherUsersCollectibles(state),
        routePath: getCurrentRoutePath(state),
    };
};
export const AllCollectiblesListContainer = connect(allMapStateToProps)(CollectiblesList);

const myMapStateToProps = (state: StoreState): Props => {
    return {
        collectibles: getUserCollectibles(state),
        routePath: getCurrentRoutePath(state),
    };
};
export const MyCollectiblesListContainer = connect(myMapStateToProps)(CollectiblesList);
