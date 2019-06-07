import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { setCollectiblesListFilterType, setCollectiblesListSortType } from '../../../store/actions';
import {
    getAllCollectiblesFetchStatus,
    getRouterLocationSearch,
    getUserCollectibles,
    getUsersCollectiblesAvailableToList,
} from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { AllCollectiblesFetchStatus, Collectible, StoreState } from '../../../util/types';
import { CenteredWrapper } from '../../common/centered_wrapper';
import { SellCollectiblesButton } from '../marketplace/sell_collectibles_button';

import { CollectiblesCardList } from './collectibles_card_list';
import { CollectiblesListFilter } from './collectibles_list_filter';
import { CollectiblesListSort } from './collectibles_list_sort';

interface OwnProps {
    title: string;
}

interface StateProps {
    collectibles: { [key: string]: Collectible };
    search: string;
    fetchStatus: AllCollectiblesFetchStatus;
}

interface DispatchProps {
    setSortType: (sortType: CollectibleSortType | null) => any;
    setFilterType: (filterType: CollectibleFilterType | null) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

const FiltersMenu = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto 22px;
    max-width: ${themeBreakPoints.xxl};
    position: relative;
    width: 100%;
    z-index: 1;

    @media (min-width: ${themeBreakPoints.md}) {
        align-items: center;
        flex-direction: row;
        padding-top: 24px;
    }
`;

const CollectiblesFilterDropdown = css`
    margin-bottom: 25px;
    margin-right: auto;
    position: relative;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-bottom: 0;
        margin-right: 25px;
    }

    &:last-child {
        margin-bottom: 0;

        @media (min-width: ${themeBreakPoints.md}) {
            margin-right: 0;
        }
    }
`;

const CollectiblesListSortStyled = styled(CollectiblesListSort)`
    ${CollectiblesFilterDropdown}

    z-index: 5;
`;

const CollectiblesListFilterStyled = styled(CollectiblesListFilter)`
    ${CollectiblesFilterDropdown}

    z-index: 1;
`;

const Title = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-bottom: 0;
        margin-right: 30px;
    }
`;

export class CollectiblesList extends React.Component<Props, {}> {
    public componentWillUnmount = () => {
        this.props.setSortType(null);
        this.props.setFilterType(null);
    };

    public render = () => {
        const { title, search, fetchStatus } = this.props;
        const collectibles = Object.keys(this.props.collectibles).map(key => this.props.collectibles[key]);
        const { sortType, filterType } = this._getSortTypeAndFilterTypeFromLocationSearch(search);
        const isLoading = fetchStatus !== AllCollectiblesFetchStatus.Success;

        return (
            <CenteredWrapper>
                <FiltersMenu>
                    <Title>{title}</Title>
                    <CollectiblesListSortStyled currentValue={sortType} onChange={this._onChangeSortType} />
                    <CollectiblesListFilterStyled currentValue={filterType} onChange={this._onChangeFilterType} />
                    <SellCollectiblesButton />
                </FiltersMenu>
                <CollectiblesCardList
                    collectibles={collectibles}
                    filterType={filterType}
                    isLoading={isLoading}
                    sortType={sortType}
                />
            </CenteredWrapper>
        );
    };

    private readonly _onChangeSortType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setSortType(evt.target.value as CollectibleSortType);
    };

    private readonly _onChangeFilterType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setFilterType(evt.target.value as CollectibleFilterType);
    };

    private readonly _getSortTypeAndFilterTypeFromLocationSearch = (search: string) => {
        const parsedSearch = queryString.parse(search);
        return {
            sortType: (parsedSearch.sort as CollectibleSortType) || CollectibleSortType.NewestAdded,
            filterType: (parsedSearch.filter as CollectibleFilterType) || CollectibleFilterType.ShowAll,
        };
    };
}

// "All Collectibles" and "My Collectibles" get different selectors
const allMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getUsersCollectiblesAvailableToList(state),
        search: getRouterLocationSearch(state),
        fetchStatus: getAllCollectiblesFetchStatus(state),
    };
};

const myMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getUserCollectibles(state),
        search: getRouterLocationSearch(state),
        fetchStatus: getAllCollectiblesFetchStatus(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        setSortType: (sortType: CollectibleSortType | null) => {
            dispatch(setCollectiblesListSortType(sortType));
        },
        setFilterType: (filterType: CollectibleFilterType | null) => {
            dispatch(setCollectiblesListFilterType(filterType));
        },
    };
};

export const AllCollectiblesListContainer = connect(
    allMapStateToProps,
    mapDispatchToProps,
)(CollectiblesList);

export const MyCollectiblesListContainer = connect(
    myMapStateToProps,
    mapDispatchToProps,
)(CollectiblesList);
