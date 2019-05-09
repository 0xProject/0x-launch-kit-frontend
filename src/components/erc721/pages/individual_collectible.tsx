import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { themeBreakPoints } from '../../../themes/commons';
import { Collectible, StoreState } from '../../../util/types';
import { CheckMetamaskStateModalContainer } from '../../common/check_metamask_state_modal_container';
import { ColumnNarrow } from '../../common/column_narrow';
import { ColumnWide } from '../../common/column_wide';
import { AssetDescriptionContainer } from '../marketplace/asset_description_container';
import { BuySellAsset } from '../marketplace/buy_sell_asset';
import { AssetButtonOrderType } from '../marketplace/marketplace_common';

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
    asset: Collectible | undefined;
}

type Props = OwnProps & StateProps;

const getAssetOrderType = (currentUserAccount: string, asset: Collectible): AssetButtonOrderType => {
    const { price, currentOwner } = asset;

    if (currentUserAccount === currentOwner) {
        // The owner is the current user and the asset has a price: Show cancel button
        if (price) {
            return AssetButtonOrderType.Cancel;
        }
        // The owner is the current user and the asset doesn't have a price: Show sell button
        return AssetButtonOrderType.Sell;
    } else if (price) {
        // The owner is not the current user and the asset has a price: Show buy button
        return AssetButtonOrderType.Buy;
    }
    // The owner is not the current user and the asset doesn't have a price: Should never happen
    throw new Error('An order without price should have an owner equal to the current user');
};

const CollectiblePage = (props: Props) => {
    const { asset, ethAccount } = props;
    if (!asset) {
        return null;
    }
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

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        asset: getCollectibleById(state, props),
    };
};

const CollectibleContainer = connect(mapStateToProps)(CollectiblePage);

export { CollectiblePage, CollectibleContainer };
