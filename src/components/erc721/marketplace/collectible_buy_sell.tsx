import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getCollectibleById, getEthAccount } from '../../../store/selectors';
import { Collectible, StoreState } from '../../../util/types';
import { Button as ButtonBase } from '../../common/button';

import { CollectibleButtonOrderType, TitleText } from './marketplace_common';

const BuySellWrapper = styled.div`
    width: 270px;
`;

interface ImageProps {
    imageUrl: string;
    imageColor: string;
}

const Image = styled.div<ImageProps>`
    left: calc(50% - 216px / 2);
    background-size: 100% 100%;
    background-image: url(${props => props.imageUrl});
    background-color: ${props => props.imageColor};
    border-radius: 4px;
    height: 221px;
`;

interface BtnStyledProps {
    btnColor: string;
    backgroundColor?: string;
}

const BtnStyled = styled(ButtonBase)`
    width: 100%;
    margin-top: 12px;
    background-color: ${(props: BtnStyledProps) => (props.backgroundColor ? props.backgroundColor : 'transparent')};
    border: ${(props: BtnStyledProps) => (props.btnColor ? '1px solid #ff6534' : 'none')};
    color: ${(props: BtnStyledProps) => (props.btnColor ? props.btnColor : '#ffffff')};
`;

const CenteredText = styled(TitleText)`
    text-align: center;
`;

const TextWithIcon = styled(CenteredText)`
    :before {
        content: url(''); // TODO add icon url
    }
`;

interface OwnProps {
    assetId: string;
}

interface StateProps {
    ethAccount: string;
    asset: Collectible | undefined;
}

type Props = OwnProps & StateProps;

const getCollectibleOrderType = (currentUserAccount: string, asset: Collectible): CollectibleButtonOrderType => {
    const { price, currentOwner } = asset;

    if (currentUserAccount.toLowerCase() === currentOwner.toLowerCase()) {
        // The owner is the current user and the asset has a price: Show cancel button
        if (price) {
            return CollectibleButtonOrderType.Cancel;
        }
        // The owner is the current user and the asset doesn't have a price: Show sell button
        return CollectibleButtonOrderType.Sell;
    } else if (price) {
        // The owner is not the current user and the asset has a price: Show buy button
        return CollectibleButtonOrderType.Buy;
    }
    // The owner is not the current user and the asset doesn't have a price: Should never happen
    throw new Error('An order without price should have an owner equal to the current user');
};

const CollectibleBuySell = (props: Props) => {
    const { asset, ethAccount } = props;
    if (!asset) {
        return null;
    }
    const { price, name, color, image } = asset;
    const orderType = getCollectibleOrderType(ethAccount, asset);
    let btnTxt;
    let btnColor = '#ffffff'; // buy color
    let backgroundColor;
    switch (orderType) {
        case CollectibleButtonOrderType.Sell: {
            backgroundColor = '#ff6534';
            btnTxt = `Sell ${name}`;
            break;
        }
        case CollectibleButtonOrderType.Buy: {
            backgroundColor = '#00AE99';
            btnTxt = `Buy for ${price} ETH`;
            break;
        }
        case CollectibleButtonOrderType.Cancel: {
            btnTxt = 'Cancel Sale';
            btnColor = '#ff6534';
            break;
        }
        default: {
            break;
        }
    }
    return (
        <BuySellWrapper>
            <Image imageUrl={image} imageColor={color} />
            <BtnStyled btnColor={btnColor} backgroundColor={backgroundColor}>
                {btnTxt}
            </BtnStyled>
            <TextWithIcon>Ends wednesday, February 27, 2019</TextWithIcon>
            {orderType === CollectibleButtonOrderType.Buy || orderType === CollectibleButtonOrderType.Cancel ? (
                <CenteredText>Last price: Ξ 2023</CenteredText>
            ) : null}
        </BuySellWrapper>
    );
};

const mapStateToProps = (state: StoreState, props: OwnProps): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        asset: getCollectibleById(state, props),
    };
};

const CollectibleBuySellContainer = connect(mapStateToProps)(CollectibleBuySell);

export { CollectibleBuySell, CollectibleBuySellContainer };
