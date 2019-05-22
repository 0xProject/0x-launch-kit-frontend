import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../../common/constants';
import { getOtherUsersCollectibles } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Collectible, StoreState } from '../../../util/types';
import { Button } from '../../common/button';

import { CollectiblesCardList } from './collectibles_card_list';

interface OwnProps {
    title: string;
    description: string;
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

const Menu = styled.div`
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

const ButtonStyled = styled(Button)`
    @media (min-width: ${themeBreakPoints.md}) {
        margin-left: auto;
    }
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

const Description = styled.h3``;

const RecentlyListed = styled.h3``;

const MostValued = styled.h3``;

export class CollectiblesAll extends React.Component<Props> {
    public render = () => {
        const { title, description } = this.props;
        const collectibles = Object.keys(this.props.collectibles).map(key => this.props.collectibles[key]);

        return (
            <MainContainer>
                <Menu>
                    <Title>{title}</Title>
                    <Description>{description}</Description>
                    <ButtonStyled variant="quaternary">Sell collectibles</ButtonStyled>
                </Menu>
                <RecentlyListed>Recently listed</RecentlyListed>
                <Link
                    to={`${ERC721_APP_BASE_PATH}/list-collectibles?filter=${CollectibleFilterType.ShowAll}&sort=${
                        CollectibleSortType.NewestAdded
                    }`}
                >
                    View all
                </Link>
                <CollectiblesCardList
                    collectibles={collectibles}
                    sortType={CollectibleSortType.NewestAdded}
                    filterType={CollectibleFilterType.ShowAll}
                    limit={5}
                />
                <MostValued>Most valued</MostValued>
                <Link
                    to={`${ERC721_APP_BASE_PATH}/list-collectibles?filter=${CollectibleFilterType.ShowAll}&sort=${
                        CollectibleSortType.PriceHighToLow
                    }`}
                >
                    View all
                </Link>
                <CollectiblesCardList
                    collectibles={collectibles}
                    sortType={CollectibleSortType.PriceHighToLow}
                    filterType={CollectibleFilterType.ShowAll}
                    limit={5}
                />
            </MainContainer>
        );
    };
}

const allMapStateToProps = (state: StoreState): StateProps => {
    return {
        collectibles: getOtherUsersCollectibles(state),
    };
};
export const AllCollectiblesContainer = connect(allMapStateToProps)(CollectiblesAll);
