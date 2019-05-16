import { BigNumber } from '0x.js';
import React from 'react';
import styled from 'styled-components';

import { ETH_DECIMALS } from '../../../common/constants';
import { tokenAmountInUnits } from '../../../util/tokens';

interface Props {
    price: BigNumber | null;
}

const Badge = styled.div`
    align-items: center;
    background: ${props => props.theme.componentsTheme.cardBackgroundColor};
    border-radius: 16px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.04);
    display: flex;
    height: 31px;
    justify-content: center;
    padding: 8px 12px;
    position: absolute;
    right: 10px;
    top: 10px;
`;

const BadgeValue = styled.span`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-feature-settings: 'tnum' on, 'onum' on;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    margin-right: 6px;
`;

const BadgeAsset = styled.span`
    color: ${props => props.theme.componentsTheme.cardTitleColor};
    font-feature-settings: 'tnum' on, 'onum' on;
    font-size: 10px;
    font-weight: 400;
    line-height: 10px;
`;

export const PriceBadge = (props: Props) => {
    const { price } = props;
    if (price === null) {
        return null;
    }
    return (
        <Badge>
            <BadgeValue>{tokenAmountInUnits(price, ETH_DECIMALS)}</BadgeValue>
            <BadgeAsset>ETH</BadgeAsset>
        </Badge>
    );
};
