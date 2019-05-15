import React from 'react';
import styled from 'styled-components';

import { themeBreakPoints } from '../../../themes/commons';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { CollectibleBuySellContainer } from '../marketplace/collectible_buy_sell';
import { CollectibleDescriptionContainer } from '../marketplace/collectible_description';

const General = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
`;

const BuySellColumn = styled(ColumnWide)`
    flex-shrink: 0;
    max-width: 100%;
    width: 100%;
    @media (min-width: ${themeBreakPoints.xl}) {
        min-width: 256px;
        width: 256px;
        margin-right: 12px;
        margin-left: 6px;
    }
`;

const CollectibleDescriptionColumn = styled(ColumnNarrow)``;

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
        <General>
            <BuySellColumn>
                <CollectibleBuySellContainer collectibleId={collectibleId} />
            </BuySellColumn>
            <CollectibleDescriptionColumn>
                <CollectibleDescriptionContainer collectibleId={collectibleId} />
            </CollectibleDescriptionColumn>
        </General>
    );
};
