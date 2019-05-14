import React from 'react';
import styled from 'styled-components';

import { getLogger } from '../../../util/logger';
import { Collectible } from '../../../util/types';
import { Button as ButtonBase } from '../../common/button';

const logger = getLogger('TradeButton');

interface BtnStyledProps {
    btnColor: string;
    backgroundColor?: string;
}

const BtnStyled = styled(ButtonBase)<BtnStyledProps>`
    width: 100%;
    margin-top: 12px;
    background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'transparent')};
    border: ${props => (props.btnColor ? '1px solid #ff6534' : 'none')};
    color: ${props => (props.btnColor ? props.btnColor : '#ffffff')};
`;

interface Props {
    ethAccount: string;
    asset: Collectible;
    onBuy: () => void;
    onSell: () => void;
    onCancel: () => void;
}

export const TradeButton: React.FC<Props> = ({ ethAccount, asset, onBuy, onSell, onCancel }) => {
    const { currentOwner, name, order } = asset;
    const isOwner = ethAccount.toLowerCase() === currentOwner.toLowerCase();

    if (isOwner && order) {
        return (
            <BtnStyled btnColor={'#ff6534'} onClick={onCancel}>
                Cancel Sale
            </BtnStyled>
        );
    } else if (isOwner && !order) {
        return (
            <BtnStyled btnColor={'#ffffff'} backgroundColor={'#ff6534'} onClick={onSell}>
                Sell {name}
            </BtnStyled>
        );
    } else if (!isOwner && order) {
        const price = order.takerAssetAmount;

        return (
            <BtnStyled btnColor={'#ffffff'} backgroundColor={'#00AE99'} onClick={onBuy}>
                Buy for {price.toString()} ETH
            </BtnStyled>
        );
    } else {
        logger.warn("User shouldn't be able to see a collectible that doesn't own and that it's not for sale");
        return null;
    }
};
