import React from 'react';
import styled from 'styled-components';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../components/common/column_narrow';
import { ColumnWide } from '../../components/common/column_wide';
import { themeBreakPoints } from '../../themes/commons';
import { AssetDescriptionContainer } from '../components/marketplace/asset_description_container';
import { BuySellAsset } from '../components/marketplace/buy_sell_asset';
import { AssetOrderType, Collectible } from '../components/marketplace/marketplace_common';

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

interface OwnProps {
    assetId: string;
}

type Props = OwnProps;

export const IndividualAsset = (props: Props) => {
    const asset = getAssetById(props.assetId);
    const orderType = AssetOrderType.Buy;
    return (
        <General>
            <BuySellColumn>
                <BuySellAsset asset={asset} orderType={orderType} />
            </BuySellColumn>
            <AssetDescriptionColumn>
                <AssetDescriptionContainer asset={asset} />
            </AssetDescriptionColumn>
            <CheckMetamaskStateModalContainer />
        </General>
    );
};

// TODO - mocked function, remove once the asset store implementation is ready
const getAssetById = (assetId: string): Collectible => {
    return {
        name: 'Vulcat',
        price: '4.4',
        color: '#ffefa7',
        image: 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png',
        assetId: '1',
        description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam.`,
        currentOwner: '0x5409ed021d9299bf6814279a6a1411a7e866a631',
        assetUrl: 'https://www.cryptokitties.co/',
    };
};
