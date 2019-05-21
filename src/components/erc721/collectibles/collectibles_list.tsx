import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Collectible, StoreState } from '../../../util/types';

import { CollectiblesCardList } from './collectibles_card_list';
import { CollectiblesListFilter } from './collectibles_list_filter';
import { CollectiblesListSort } from './collectibles_list_sort';

interface OwnProps {
    title: string;
}

interface StateProps {
    collectibles: { [key: string]: Collectible };
}

type Props = StateProps & OwnProps;

interface State {
    sortType: CollectibleSortType;
    filterType: CollectibleFilterType;
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
    margin: 0 auto 22px;
    max-width: ${themeBreakPoints.xxl};
    padding: 24px 0 0;
    width: 100%;
`;

const Title = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0;
`;

export class CollectiblesList extends React.Component<Props, State> {
    public state = {
        sortType: CollectibleSortType.NewestAdded,
        filterType: CollectibleFilterType.ShowAll,
    };

    public render = () => {
        const { title } = this.props;
        const collectibles = Object.keys(this.props.collectibles).map(key => this.props.collectibles[key]);
        const { sortType, filterType } = this.state;
        return (
            <MainContainer>
                <FiltersMenu>
                    <Title>{title}</Title>
                    <CollectiblesListSort currentValue={sortType} onChange={this._onChange} />
                    <CollectiblesListFilter currentValue={filterType} onChange={this._onChangeFilter} />
                </FiltersMenu>
                <CollectiblesCardList collectibles={collectibles} sortType={sortType} filterType={filterType} />
            </MainContainer>
        );
    };

    private _onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const sortType = evt.target.value as CollectibleSortType;
        this.setState({ sortType });
    };

    private _onChangeFilter = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const filterType = evt.target.value as CollectibleFilterType;
        this.setState({ filterType });
    };
}

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
