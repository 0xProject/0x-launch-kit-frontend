import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { selectCollectible } from '../../../store/collectibles/actions';
import { themeDimensions, themeFeatures } from '../../../themes/commons';
import { getCollectiblePrice } from '../../../util/collectibles';
import { Collectible } from '../../../util/types';

import { PriceBadge } from './price_badge';

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    collectible: Collectible;
    onClick: () => any;
}

interface DispatchProps {
    updateSelectedCollectible: (collectible: Collectible) => any;
}

type Props = DispatchProps & OwnProps;

const CollectibleAssetWrapper = styled.div`
    background: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    transition: box-shadow 0.15s linear;

    &:hover {
        box-shadow: ${themeFeatures.boxShadow};
    }
`;

const ImageWrapper = styled.div<{ color: string; image: string }>`
    background-color: ${props => props.color || props.theme.componentsTheme.cardBackgroundColor};
    background-image: url('${props => props.image}');
    background-position: 50% 50%;
    background-size: contain;
    border-top-left-radius: ${themeDimensions.borderRadius};
    border-top-right-radius: ${themeDimensions.borderRadius};
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

// TODO maybe refactor to avoid code duplication with collectible_details
export const CollectibleOnList: React.FC<Props> = (props: Props) => {
    const { collectible, onClick } = props;
    const { color, image, name } = collectible;
    const price = getCollectiblePrice(collectible);

    const handleAssetClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        onClick();
        try {
            props.updateSelectedCollectible(collectible);
        } catch (err) {
            window.alert(`Could not sell the specified order`);
        }
    };

    return (
        <CollectibleAssetWrapper onClick={handleAssetClick}>
            <ImageWrapper color={color} image={image}>
                <PriceBadge price={price} />
            </ImageWrapper>
            <Title>{name}</Title>
        </CollectibleAssetWrapper>
    );
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        updateSelectedCollectible: (collectible: Collectible) => dispatch(selectCollectible(collectible)),
    };
};

export const CollectibleOnListContainer = connect(
    null,
    mapDispatchToProps,
)(CollectibleOnList);
