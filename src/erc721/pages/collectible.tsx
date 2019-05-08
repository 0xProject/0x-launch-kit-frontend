import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { CheckMetamaskStateModalContainer } from '../../components/common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../components/common/column_narrow';
import { ColumnWide } from '../../components/common/column_wide';
import { getEthAccount } from '../../store/selectors';
import { themeBreakPoints } from '../../themes/commons';
import { StoreState } from '../../util/types';
import { AssetDescriptionContainer } from '../components/marketplace/asset_description_container';
import { BuySellAsset } from '../components/marketplace/buy_sell_asset';
import { Asset, AssetButtonOrderType } from '../components/marketplace/marketplace_common';

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

interface StateProps {
    ethAccount: string;
}

type Props = OwnProps & StateProps;

// TODO - mocked function, remove once the asset store implementation is ready
const getAssetById = (assetId: string): Asset => {
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

const getAssetOrderType = (currentUserAccount: string, asset: Asset): AssetButtonOrderType => {
    const { price, currentOwner } = asset;

    if (currentUserAccount === currentOwner) {
        // The owner is the current user and the asset has a price: Show cancel button
        if (price) {
            return AssetButtonOrderType.Cancel;
        }
        // The owner is the current user and the asset doesn't have a price: Show sell button
        return AssetButtonOrderType.Sell;
    } else if (asset.price) {
        // The owner is not the current user and the asset has a price: Show buy button
        return AssetButtonOrderType.Buy;
    }
    // The owner is not the current user and the asset doesn't have a price: Should never happen
    throw new Error('An order without price should have an owner equal to the current user');
};

const Collectible = (props: Props) => {
    const { assetId, ethAccount } = props;
    const asset = getAssetById(assetId);
    const orderType = getAssetOrderType(ethAccount, asset);
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

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const CollectibleContainer = connect(mapStateToProps)(Collectible);

export { Collectible, CollectibleContainer };
