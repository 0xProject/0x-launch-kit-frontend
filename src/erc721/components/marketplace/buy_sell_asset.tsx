import React from 'react';
import styled from 'styled-components';

import { Button } from '../../../components/common/button';
import { OrderSide } from '../../../util/types';

const CollectibleAssetWrapper = styled.div`
    position: relative;
    background: #ffefa7;
    border: 1px solid #ededed;
    box-sizing: border-box;
    border-radius: 4px;
    width: 270px;
    height: 270px;
`;

const Image = styled.div<{ image: string }>`
    position: absolute;
    width: 216px;
    height: 221px;
    left: calc(50% - 216px / 2);
    top: calc(50% - 221px / 2);
    background-size: 100% 100%;
    background-image: url(${props => props.image});
`;

const BtnStyled = styled.div<{ btnColor: string}>`
    width: 270px;
    height: 46px;
    border-radius: 4px;
    margin-top: 90%;
    background-color: ${props => props.btnColor };
`;

const assetImg = 'https://res.cloudinary.com/ddklsa6jc/image/upload/v1556888670/6_w93q19.png';

enum AssetOrderType {
    Buy = 'BUY',
    Sell = 'BUY',
    Cancel = 'CANCEL',
}

// TODO REFACTOR
export const BuySellAsset = (props: any) => {
    const assetType = AssetOrderType.Cancel;
    let btnTxt;
    let btnColor; // buy color
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
        case AssetOrderType.Cancel: {
            btnColor = '#E5E5E5';
            btnTxt = 'Cancel Sale';
            break;
        }
    }
    return (
        <>
            <CollectibleAssetWrapper>
                <Image image={assetImg} />
                <BtnStyled btnColor={btnColor}>{btnTxt}</BtnStyled>
                <h3>Ends wednesday, February 27, 2019</h3>
                <h3>Last price: 2023</h3>
            </CollectibleAssetWrapper>
        </>
    );
};
