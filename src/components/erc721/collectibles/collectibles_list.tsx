import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../../common/constants';
import { getCurrentRoutePath, getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';
import { Dropdown } from '../../common/dropdown';
import { ChevronDownIcon } from '../../common/icons/chevron_down_icon';

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
`;

const Title = styled.div`
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
`;

const FilterHeaderText = styled.span`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-feature-settings: 'calt' 0;
    font-size: 16px;
    font-weight: 500;
    margin-right: 10px;
`;

export const CollectiblesList = (props: Props) => {
    const collectibles = Object.keys(props.collectibles).map(key => props.collectibles[key]);
    const newestAddedHeader = (
        <>
            <FilterHeaderText>Newest added</FilterHeaderText>
            <ChevronDownIcon />
        </>
    );
    const auctionsHeader = (
        <>
            <FilterHeaderText>Auctions, Fixed Price</FilterHeaderText>
            <ChevronDownIcon />
        </>
    );
    const title = props.routePath === `${ERC721_APP_BASE_PATH}/my-collectibles` ? 'My Collectibles' : 'Cryptokitties';
    return (
        <MainContainer>
            <FiltersMenu>
                <Title>{title}</Title>
                <Dropdown body={null} header={newestAddedHeader} />
                <Dropdown body={null} header={auctionsHeader} />
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
