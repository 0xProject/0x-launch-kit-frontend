import { BigNumber } from '0x.js';
import React from 'react';
import styled, { withTheme } from 'styled-components';

import { ETH_DECIMALS } from '../../../common/constants';
import { Theme } from '../../../themes/commons';
import { getCollectiblePrice } from '../../../util/collectibles';
import { getLogger } from '../../../util/logger';
import { isDutchAuction } from '../../../util/orders';
import { tokenAmountInUnits } from '../../../util/tokens';
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
    isDisabled?: boolean;
    onBuy: () => void;
    onCancel: () => void;
    onSell: () => void;
    theme: Theme;
}

export const TradeButtonContainer: React.FC<Props> = ({
    asset,
    ethAccount,
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

    if (isOwner && order && !isDutchAuction(order)) {
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
        const price = getCollectiblePrice(asset) as BigNumber;
        backgroundColor = theme.componentsTheme.buttonCollectibleSellBackgroundColor;
        borderColor = theme.componentsTheme.buttonCollectibleSellBackgroundColor;
        buttonText = `Buy for ${tokenAmountInUnits(price, ETH_DECIMALS)} ETH`;
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
