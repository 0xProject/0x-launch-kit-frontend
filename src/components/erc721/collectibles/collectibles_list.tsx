import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { getOtherUsersCollectibles, getUserCollectibles } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Collectible, StoreState } from '../../../util/types';
import { SellCollectiblesButton } from '../marketplace/sell_collectibles_button';

import { CollectiblesCardList } from './collectibles_card_list';
import { CollectiblesListFilter } from './collectibles_list_filter';
import { CollectiblesListSort } from './collectibles_list_sort';

interface OwnProps {
    title: string;
}

interface StateProps {
    collectibles: { [key: string]: Collectible };
}

interface DispatchProps {
    toggleCollectibleListModal: () => any;
}
type Props = StateProps & DispatchProps & OwnProps;

interface State {
    filterType: CollectibleFilterType;
    sortType: CollectibleSortType;
}

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-basis: 100%;
`;

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
                    <CollectiblesListSortStyled currentValue={sortType} onChange={this._onChangeSortType} />
                    <CollectiblesListFilterStyled currentValue={filterType} onChange={this._onChangeFilterType} />
                    <SellCollectiblesButton />
                </FiltersMenu>
                <CollectiblesCardList collectibles={collectibles} sortType={sortType} filterType={filterType} />
            </MainContainer>
        );
    };

    private readonly _onChangeSortType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ sortType: evt.target.value as CollectibleSortType });
    };

    private readonly _onChangeFilterType = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filterType: evt.target.value as CollectibleFilterType });
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
