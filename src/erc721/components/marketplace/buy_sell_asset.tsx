import React from 'react';
import styled from 'styled-components';

import { Button as ButtonBase } from '../../../components/common/button';

import { AssetOrderType, TitleText } from './marketplace_common';

const BuySellWrapper = styled.div`
    width: 270px;
`;

const Image = styled.div<{ image: string }>`
    left: calc(50% - 216px / 2);
    background-size: 100% 100%;
    background-image: url(${props => props.image});
    background-color: #ffefa7;
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

const assetImg = 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png';

const CenteredText = styled(TitleText)`
    text-align: center;
`;

const TextWithIcon = styled(CenteredText)`
    :before {
        content: url(''); // TODO add icon url
    }
`;

interface OwnProps {
    assetType: AssetOrderType;
}

type Props = OwnProps;

// TODO REFACTOR
export const BuySellAsset = (props: Props) => {
    let btnTxt;
    let btnColor = '#ffffff'; // buy color
    let backgroundColor;
    const assetPrice = '4.4';
    const assetName = 'Vulcat';
    switch (props.assetType) {
        case AssetOrderType.Sell: {
            backgroundColor = '#ff6534';
            btnTxt = `Sell ${assetName}`;
            break;
        }
        case AssetOrderType.Buy: {
            backgroundColor = '#00AE99';
            btnTxt = `Buy for ${assetPrice} ETH`;
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
                <Image image={assetImg} />
                <BtnStyled btnColor={btnColor} backgroundColor={backgroundColor}>
                    {btnTxt}
                </BtnStyled>
                <TextWithIcon>Ends wednesday, February 27, 2019</TextWithIcon>
                {props.assetType === AssetOrderType.Buy || props.assetType === AssetOrderType.Cancel ? (
                    <CenteredText>Last price: Ξ 2023</CenteredText>
                ) : null}
            </BuySellWrapper>
        </>
    );
};
