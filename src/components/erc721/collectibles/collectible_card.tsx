import { BigNumber } from '0x.js';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ERC721_APP_BASE_PATH } from '../../../common/constants';
import { themeDimensions, themeFeatures } from '../../../themes/commons';

import { PriceBadge } from './price_badge';

interface Props {
    color: string;
    id: string;
    image: string;
    name: string;
    price: BigNumber | null;
    onClick?: (e: any) => void;
}

const CollectibleCardWrapper = styled(Link)`
    background: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    transition: box-shadow 0.15s linear;
    text-decoration: none;

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

const defaultHandleClick = (e: any) => undefined;

export const CollectibleCard: React.FC<Props> = (props: Props) => {
    const { id, name, price, image, color, onClick, ...restProps } = props;
    return (
        <CollectibleCardWrapper
            {...restProps}
            id={id}
            onClick={onClick || defaultHandleClick}
            to={`${ERC721_APP_BASE_PATH}/collectible/${props.id}`}
        >
            <ImageWrapper color={color} image={image}>
                <PriceBadge price={price} />
            </ImageWrapper>
            <Title>{name}</Title>
        </CollectibleCardWrapper>
    );
};
