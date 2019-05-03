import React from 'react';
import styled from 'styled-components';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../components/common/column_narrow';
import { ColumnWide } from '../../components/common/column_wide';
import { AssetDescriptionContainer } from '../components/marketplace/asset_description_container';
import { BuySellAsset } from '../components/marketplace/buy_sell_asset';

const General = styled.div`
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    background-color: orange;
`;

const BuySellColumn = styled(ColumnWide)`
    background-color: red;
`;

const AssetDescriptionColumn = styled(ColumnNarrow)`
    position: relative;
`;

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
