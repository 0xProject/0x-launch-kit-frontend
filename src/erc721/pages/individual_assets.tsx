import React from 'react';
import styled from 'styled-components';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../components/common/column_narrow';
import { ColumnWide } from '../../components/common/column_wide';
import { themeBreakPoints } from '../../themes/commons';
import { AssetDescriptionContainer } from '../components/marketplace/asset_description_container';
import { BuySellAsset } from '../components/marketplace/buy_sell_asset';

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

const AssetDescriptionColumn = styled(ColumnNarrow)``;

export const IndividualAsset = (props: any) => {
    return (
        <General>
            <BuySellColumn>
                <BuySellAsset />
            </BuySellColumn>
            <AssetDescriptionColumn>
                <AssetDescriptionContainer />
            </AssetDescriptionColumn>
            <CheckMetamaskStateModalContainer />
        </General>
    );
};
