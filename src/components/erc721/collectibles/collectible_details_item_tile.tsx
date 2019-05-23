import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions, themeFeatures } from '../../../themes/commons';

import { PriceBadge } from './price_badge';

interface Props extends HTMLAttributes<HTMLDivElement> {
    color: string;
    image: string;
    name: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => any;
    price: BigNumber | null;
}

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

export const TileItem: React.FC<Props> = (props: Props) => {
    const { onClick, color, image, price, name } = props;
    return (
        <CollectibleAssetWrapper onClick={onClick}>
            <ImageWrapper color={color} image={image}>
                <PriceBadge price={price} />
            </ImageWrapper>
            <Title>{name}</Title>
        </CollectibleAssetWrapper>
    );
};
