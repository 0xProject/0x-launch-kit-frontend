import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';

interface OwnProps {
    title: string;
}

interface StateProps {
    collectibles: { [key: string]: Collectible };
}

type Props = StateProps & OwnProps;

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-basis: 100%;
`;

const FiltersMenu = styled.div`
    display: flex;
    flex-direction: row;
    padding: 0 48px 10px;
`;

const Title = styled.div`
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
`;

export const CollectiblesList = (props: Props) => {
    const collectibles = Object.keys(props.collectibles).map(key => props.collectibles[key]);
    return (
        <MainContainer>
            <FiltersMenu>
                <Title>{props.title}</Title>
            </FiltersMenu>
            <CollectiblesCardList collectibles={collectibles} />
        </MainContainer>
    );
};

const allMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getOtherUsersCollectibles(state),
    };
};
export const AllCollectiblesListContainer = connect(allMapStateToProps)(CollectiblesList);

const myMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getUserCollectibles(state),
    };
};
export const MyCollectiblesListContainer = connect(myMapStateToProps)(CollectiblesList);
