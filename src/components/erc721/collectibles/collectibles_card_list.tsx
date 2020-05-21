import React from 'react';
import styled from 'styled-components';

import { EmptyContent } from '../../../components/common/empty_content';
import { LoadingWrapper } from '../../../components/common/loading';
import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleFilterType, getFilterFunction } from '../../../util/filterable_collectibles';
import { CollectibleSortType, getSortedCollectibles } from '../../../util/sortable_collectibles';
import { Collectible } from '../../../util/types';

import { CollectibleCardContainer } from './collectible_card';

const CollectiblesListOverflow = styled.div`
    flex-grow: 1;
    overflow: auto;
`;

const CollectiblesList = styled.div`
    column-gap: 16px;
    display: grid;
    grid-template-columns: 1fr;
    margin: 0 auto;
    max-width: ${themeBreakPoints.xxl};
    row-gap: 24px;
    width: 100%;

    @media (min-width: ${themeBreakPoints.md}) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: ${themeBreakPoints.xl}) {
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media (min-width: ${themeBreakPoints.xxl}) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
`;

const Loading = styled(LoadingWrapper)`
    flex-grow: 1;
`;

const getCollectibleCards = (
    collectibles: Collectible[],
    sortType: CollectibleSortType,
    filterType: CollectibleFilterType,
    limit?: number,
    onClick?: (e: any) => void,
) => {
    const sortedItems = getSortedCollectibles(collectibles, sortType);
    let filteredItems = sortedItems.filter(getFilterFunction(filterType));
    if (limit) {
        filteredItems = filteredItems.slice(0, limit);
    }
    return filteredItems.map((sortableCollectible, index) => {
        const { collectible, price } = sortableCollectible;
        return <CollectibleCardContainer collectible={collectible} key={index} onClick={onClick} price={price} />;
    });
};

interface Props {
    collectibles: Collectible[];
    sortType: CollectibleSortType;
    filterType: CollectibleFilterType;
    limit?: number;
    isLoading?: boolean;
    onClick?: (e: any) => void;
    className?: string;
}

export const CollectiblesCardList = (props: Props) => {
    const { collectibles, sortType, filterType, limit, isLoading, onClick, className, ...restProps } = props;
    const collectibleCards = getCollectibleCards(collectibles, sortType, filterType, limit, onClick);

    if (isLoading) {
        return <Loading />;
    }
    if (collectibleCards.length === 0) {
        return <EmptyContent text="No results." />;
    }

    return (
        <CollectiblesListOverflow className={className} {...restProps}>
            <CollectiblesList>{collectibleCards}</CollectiblesList>
        </CollectiblesListOverflow>
    );
};
