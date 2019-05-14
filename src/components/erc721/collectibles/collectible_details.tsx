import { BigNumber } from '0x.js';
import React, { HTMLAttributes } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToIndividualCollectible } from '../../../store/router/actions';
import { themeDimensions, themeFeatures } from '../../../themes/commons';

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    color: string;
    id: string;
    image: string;
    name: string;
    price: BigNumber | null;
}

interface DispatchProps {
    goToIndividualCollectible: (collectibleId: string) => any;
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
        box-shadow: ${props => themeFeatures.boxShadow};
    }
`;

const ImageWrapper = styled.div<{ color: string; image: string }>`
    background-color: ${props => props.color};
    background-image: url('${props => props.image}');
    background-position: 50% 50%;
    background-size: contain;
    border-top-left-radius: ${themeDimensions.borderRadius};
    border-top-right-radius: ${themeDimensions.borderRadius};
    height: 272px;
`;

const Title = styled.h2`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    overflow: hidden;
    padding: 10px 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Badge = styled.div`
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.04);
    height: 31px;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 84px;
`;

const BadgeImport = styled.span`
    color: #000;
    font-family: Inter UI;
    font-feature-settings: 'tnum' on, 'onum' on;
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    height: 23px;
    line-height: 21px;
    position: absolute;
    right: 30px;
    top: 6px;
    width: 42px;
`;

const BadgeAsset = styled.span`
    color: #000000;
    font-family: Inter UI;
    font-feature-settings: 'tnum' on, 'onum' on;
    font-size: 10px;
    font-style: normal;
    font-weight: normal;
    height: 15px;
    line-height: 15px; /* identical to box height */
    position: absolute;
    right: 9px;
    top: 11px;
    width: 20px;
`;

export const CollectibleAsset: React.FC<Props> = (props: Props) => {
    const { id, name, price, image, color, ...restProps } = props;

    const handleAssetClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.goToIndividualCollectible(id);
    };

    return (
        <CollectibleAssetWrapper {...restProps} onClick={handleAssetClick}>
            <ImageWrapper color={color} image={image}>
                {price && (
                    <Badge>
                        <BadgeImport>{price.toString()}</BadgeImport>
                        <BadgeAsset>ETH</BadgeAsset>
                    </Badge>
                )}
            </ImageWrapper>
            <Title>{name}</Title>
        </CollectibleAssetWrapper>
    );
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        goToIndividualCollectible: (collectibleId: string) => dispatch(goToIndividualCollectible(collectibleId)),
    };
};

export const CollectibleAssetContainer = connect(
    null,
    mapDispatchToProps,
)(CollectibleAsset);
