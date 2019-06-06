import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../../common/constants';
import { getEthAccount } from '../../../store/selectors';
import { themeDimensions, themeFeatures } from '../../../themes/commons';
import { Collectible, StoreState } from '../../../util/types';

import { OwnerBadge } from './owner_badge';
import { PriceBadge } from './price_badge';

const CollectibleCardWrapper = styled(Link)`
    background: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: box-shadow 0.15s linear;
    text-decoration: none;

    &:hover {
        box-shadow: ${themeFeatures.boxShadow};
    }
`;

const ImageWrapper = styled.div<{ color: string; image: string }>`
    background-clip: padding-box;
    background-color: ${props => props.color || props.theme.componentsTheme.cardImageBackgroundColor};
    background-image: url('${props => props.image}');
    background-position: 50% 50%;
    background-size: contain;
    height: 272px;
`;

const Title = styled.h2`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    overflow: hidden;
    padding: 10px 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const defaultHandleClick = (e: any) => undefined;

interface OwnProps {
    collectible: Collectible;
    price: BigNumber | null;
    onClick?: (e: any) => void;
}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;

class CollectibleCard extends React.Component<Props> {
    public render = () => {
        const { collectible, price, ethAccount, onClick, ...restProps } = this.props;
        const { currentOwner, tokenId, color, image, name } = collectible;
        const isOwner = currentOwner.toLowerCase() === ethAccount.toLowerCase();
        const ownerBadge = isOwner ? <OwnerBadge /> : null;

        return (
            <CollectibleCardWrapper
                {...restProps}
                id={tokenId}
                onClick={onClick || defaultHandleClick}
                to={`${ERC721_APP_BASE_PATH}/collectible/${tokenId}`}
            >
                <ImageWrapper color={color} image={image}>
                    {ownerBadge}
                    <PriceBadge price={price} />
                </ImageWrapper>
                <Title>{name}</Title>
            </CollectibleCardWrapper>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const CollectibleCardContainer = connect(
    mapStateToProps,
    {},
)(CollectibleCard);

export { CollectibleCard, CollectibleCardContainer };
