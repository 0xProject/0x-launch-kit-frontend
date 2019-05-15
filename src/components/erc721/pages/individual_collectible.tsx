import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';
import { CollectibleBuySellContainer } from '../marketplace/collectible_buy_sell';
import { CollectibleDescriptionContainer } from '../marketplace/collectible_description';

const IndividualCollectibleWrapper = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0 auto;
    max-width: ${themeBreakPoints.xxl};
    width: 100%;

    @media (min-width: ${themeBreakPoints.md}) {
        align-items: flex-start;
        flex-direction: row;
        justify-content: center;
    }

    @media (min-width: ${themeBreakPoints.xl}) {
    }

    @media (min-width: ${themeBreakPoints.xxl}) {
    }
`;

const CollectibleBuySell = styled(CollectibleBuySellContainer)`
    flex-grow: 0;
    flex-shrink: 0;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-right: 12px;
    }
`;

const CollectibleDescription = styled(CollectibleDescriptionContainer)`
    max-width: ${themeBreakPoints.xxl};
`;

interface OwnProps {
    collectibleId: string;
}

type Props = OwnProps;

export const IndividualCollectible = (props: Props) => {
    const { collectibleId } = props;
    if (!collectibleId) {
        return null;
    }

    return (
        <IndividualCollectibleWrapper>
            <CollectibleBuySell assetId={collectibleId} />
            <CollectibleDescription assetId={collectibleId} />
        </IndividualCollectibleWrapper>
    );
};
