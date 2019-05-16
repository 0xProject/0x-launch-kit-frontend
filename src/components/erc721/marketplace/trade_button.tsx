import React from 'react';
import styled, { withTheme } from 'styled-components';

import { Theme } from '../../../themes/commons';
import { getLogger } from '../../../util/logger';
import { Collectible } from '../../../util/types';
import { Button as ButtonBase } from '../../common/button';

const logger = getLogger('TradeButton');

interface BtnStyledProps {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

const BtnStyled = styled(ButtonBase)<BtnStyledProps>`
    background-color: ${props => props.backgroundColor};
    border: 1px solid ${props => props.borderColor};
    color: ${props => props.textColor};
    width: 100%;
`;

BtnStyled.defaultProps = {
    backgroundColor: '#FF6534',
    borderColor: '#FF6534',
    textColor: '#fff',
};

interface Props {
    asset: Collectible;
    ethAccount: string;
    onBuy: () => void;
    onCancel: () => void;
    onSell: () => void;
    theme: Theme;
}

export const TradeButtonContainer: React.FC<Props> = ({
    ethAccount,
    asset,
    onBuy,
    onSell,
    onCancel,
    theme,
    ...restProps
}) => {
    const { currentOwner, name, order } = asset;
    const isOwner = ethAccount.toLowerCase() === currentOwner.toLowerCase();

    let borderColor: string;
    let backgroundColor: string;
    let textColor: string;
    let buttonText: string;
    let onClick: any;

    if (isOwner && order) {
        backgroundColor = 'transparent';
        borderColor = theme.componentsTheme.buttonErrorBackgroundColor;
        buttonText = 'Cancel Sale';
        onClick = onCancel;
        textColor = theme.componentsTheme.buttonErrorBackgroundColor;
    } else if (isOwner && !order) {
        backgroundColor = theme.componentsTheme.buttonErrorBackgroundColor;
        borderColor = theme.componentsTheme.buttonErrorBackgroundColor;
        buttonText = `Sell ${name}`;
        onClick = onSell;
        textColor = theme.componentsTheme.buttonTextColor;
    } else if (!isOwner && order) {
        const price = order.takerAssetAmount;

        backgroundColor = theme.componentsTheme.buttonSellBackgroundColor;
        borderColor = theme.componentsTheme.buttonSellBackgroundColor;
        buttonText = `Buy for ${price.toString()} ETH`;
        onClick = onBuy;
        textColor = theme.componentsTheme.buttonTextColor;
    } else {
        logger.warn("User shouldn't be able to see a collectible that doesn't own and that it's not for sale");
        return null;
    }

    return (
        <BtnStyled
            borderColor={borderColor}
            textColor={textColor}
            backgroundColor={backgroundColor}
            onClick={onClick}
            {...restProps}
        >
            {buttonText}
        </BtnStyled>
    );
};

const TradeButton = withTheme(TradeButtonContainer);

export { TradeButton };
