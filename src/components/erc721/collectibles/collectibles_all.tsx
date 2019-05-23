import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../../common/constants';
import { getOtherUsersCollectibles } from '../../../store/selectors';
import { themeBreakPoints, themeDimensions } from '../../../themes/commons';
import { CollectibleFilterType } from '../../../util/filterable_collectibles';
import { CollectibleSortType } from '../../../util/sortable_collectibles';
import { Collectible, StoreState } from '../../../util/types';
import { ViewAll } from '../../common/view_all';
import { SellCollectiblesButton } from '../marketplace/sell_collectibles_button';

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
    flex-grow: 1;
    margin: -${themeDimensions.mainPadding};
    overflow: auto;
    padding: ${themeDimensions.mainPadding};
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 0 22px;
    position: relative;
    z-index: 1;

    @media (min-width: ${themeBreakPoints.md}) {
        align-items: center;
        flex-direction: row;
        padding-top: 24px;
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

const Description = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: normal;
    line-height: 1.7;
    margin: 0 0 50px;
`;

const SubSectionTitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 0 15px;

    @media (min-width: ${themeBreakPoints.md}) {
        flex-direction: row;
    }
`;

const SubSectionTitle = styled.h3`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 15px;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-bottom: 0;
    }
`;

const CollectiblesCardListStyled = styled(CollectiblesCardList)`
    flex-grow: unset;
    margin-bottom: 65px;
    overflow: unset;

    &:last-child {
        margin-bottom: 10px;
    }
`;

export class CollectiblesAll extends React.Component<Props> {
    public render = () => {
        const { title, description } = this.props;
        const collectibles = Object.keys(this.props.collectibles).map(key => this.props.collectibles[key]);

        return (
            <MainContainer>
                <Menu>
                    <Title>{title}</Title>
                    <SellCollectiblesButton />
                </Menu>
                {description ? <Description>{description}</Description> : null}
                <SubSectionTitleWrapper>
                    <SubSectionTitle>Recently listed</SubSectionTitle>
                    <ViewAll
                        text="View all"
                        to={`${ERC721_APP_BASE_PATH}/list-collectibles?filter=${CollectibleFilterType.ShowAll}&sort=${
                            CollectibleSortType.NewestAdded
                        }`}
                    />
                </SubSectionTitleWrapper>
                <CollectiblesCardListStyled
                    collectibles={collectibles}
                    filterType={CollectibleFilterType.ShowAll}
                    limit={5}
                    sortType={CollectibleSortType.NewestAdded}
                />
                <SubSectionTitleWrapper>
                    <SubSectionTitle>Most valued</SubSectionTitle>
                    <ViewAll
                        text="View all"
                        to={`${ERC721_APP_BASE_PATH}/list-collectibles?filter=${CollectibleFilterType.ShowAll}&sort=${
                            CollectibleSortType.PriceHighToLow
                        }`}
                    />
                </SubSectionTitleWrapper>
                <CollectiblesCardListStyled
                    collectibles={collectibles}
                    filterType={CollectibleFilterType.ShowAll}
                    limit={5}
                    sortType={CollectibleSortType.PriceHighToLow}
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
