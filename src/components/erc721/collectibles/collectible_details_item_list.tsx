import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeDimensions } from '../../../themes/commons';
import { ChevronRight } from '../../common/icons/chevron_right_icon';

interface Props extends HTMLAttributes<HTMLDivElement> {
    color: string;
    image: string;
    name: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => any;
}

const CollectibleAssetWrapper = styled.div`
    border-bottom: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    cursor: pointer;
    display: flex;
    padding: 12px ${props => props.theme.modalTheme.content.padding};

    &:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }

    &:last-child {
        border-bottom: none;
    }
`;

const ImageWrapper = styled.div<{ color: string; image: string }>`
    background-color: ${props => props.color || props.theme.componentsTheme.cardBackgroundColor};
    background-image: url('${props => props.image}');
    background-position: 50% 50%;
    background-size: contain;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
    height: 72px;
    margin-right: 15px;
    width: 72px;
`;

const TextContainer = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    padding: 0 10px 0 0;
`;

const Title = styled.h3`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 5px;
    overflow: hidden;
    padding: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:last-child {
        margin-bottom: 0;
    }
`;

const ChevronContainer = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
`;

export const ListItem: React.FC<Props> = (props: Props) => {
    const { onClick, color, image, name } = props;
    return (
        <CollectibleAssetWrapper onClick={onClick}>
            <ImageWrapper color={color} image={image} />
            <TextContainer>
                <Title>{name}</Title>
            </TextContainer>
            <ChevronContainer>
                <ChevronRight />
            </ChevronContainer>
        </CollectibleAssetWrapper>
    );
};
