import React from 'react';
import styled from 'styled-components';

import { Button as ButtonBase } from '../../../components/common/button';

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
}

const BtnStyled = styled(ButtonBase)`
    width: 100%;
    background-color: ${(props: BtnStyledProps) => props.btnColor};
    margin-top: 12px;
`;

const assetImg = 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png';

enum AssetOrderType {
    Buy = 'BUY',
    Sell = 'BUY',
    Cancel = 'CANCEL',
}

// TODO REFACTOR
export const BuySellAsset = (props: any) => {
    const assetType = AssetOrderType.Buy;
    let btnTxt;
    let btnColor = '#00AE99'; // buy color
    switch (assetType) {
        // @ts-ignore
        case AssetOrderType.Buy: {
            btnColor = '#00AE99';
            btnTxt = 'Buy';
            break;
        }
        // @ts-ignore
        case AssetOrderType.Sell: {
            btnColor = '#FF6534';
            btnTxt = 'Sell';
            break;
        }
        // @ts-ignore
        case AssetOrderType.Cancel: {
            btnColor = '#E5E5E5';
            btnTxt = 'Cancel Sale';
            break;
        }
    }
    return (
        <>
            <BuySellWrapper>
                <Image image={assetImg} />
                <BtnStyled btnColor={btnColor}>{btnTxt}</BtnStyled>
                <h3>Ends wednesday, February 27, 2019</h3>
                <h3>Last price: Ξ 2023</h3>
            </BuySellWrapper>
        </>
    );
};
