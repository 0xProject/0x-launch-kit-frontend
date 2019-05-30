import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';
import { Content } from '../common/content_wrapper';
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
`;

const CollectibleBuySell = styled(CollectibleBuySellContainer)`
    flex-grow: 0;
    flex-shrink: 0;

    @media (min-width: ${themeBreakPoints.md}) {
        margin-right: 12px;
    }
`;

const CollectibleDescription = styled(CollectibleDescriptionContainer)`
    display: flex;
    flex-direction: column;
    max-width: 586px;
    min-width: 0;
    width: 100%;
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
        <Content>
            <IndividualCollectibleWrapper>
                <CollectibleBuySell collectibleId={collectibleId} />
                <CollectibleDescription collectibleId={collectibleId} />
            </IndividualCollectibleWrapper>
        </Content>
    );
};
