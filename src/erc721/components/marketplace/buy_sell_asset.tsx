import React from 'react';
import styled from 'styled-components';

import { Button as ButtonBase } from '../../../components/common/button';

import { AssetOrderType, Collectible, TitleText } from './marketplace_common';

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
    orderType: AssetOrderType;
    asset: Collectible;
}

type Props = OwnProps;

export const BuySellAsset = (props: Props) => {
    let btnTxt;
    let btnColor = '#ffffff'; // buy color
    let backgroundColor;
    const { price, name, color, image } = props.asset;
    switch (props.orderType) {
        case AssetOrderType.Sell: {
            backgroundColor = '#ff6534';
            btnTxt = `Sell ${name}`;
            break;
        }
        case AssetOrderType.Buy: {
            backgroundColor = '#00AE99';
            btnTxt = `Buy for ${price} ETH`;
            break;
        }
        case AssetOrderType.Cancel: {
            btnTxt = 'Cancel Sale';
            btnColor = '#ff6534';
            break;
        }
    }
    return (
        <>
            <BuySellWrapper>
                <Image imageUrl={image} imageColor={color} />
                <BtnStyled btnColor={btnColor} backgroundColor={backgroundColor}>
                    {btnTxt}
                </BtnStyled>
                <TextWithIcon>Ends wednesday, February 27, 2019</TextWithIcon>
                {props.orderType === AssetOrderType.Buy || props.orderType === AssetOrderType.Cancel ? (
                    <CenteredText>Last price: Ξ 2023</CenteredText>
                ) : null}
            </BuySellWrapper>
        </>
    );
};
