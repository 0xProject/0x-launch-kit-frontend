import React from 'react';
import styled from 'styled-components';

const MidMarketPriceIndicatorWell = styled.div`
    padding: 0.5rem;
    position: absolute;
    width: 10rem;
    margin: auto;
    right: 0;
    left: 0;
    top: 0;
    text-align: center;
`;

interface MidMarketPriceCardProps {
    price: number;
}

const MidMarketPriceText = styled.p`
    font-size: 14px;
    margin: 0 0 0.5rem 0;
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const MidMarketPriceLabel = styled.p`
    font-size: 12px;
    margin: 0;
    color: ${props => props.theme.componentsTheme.textDark};
`;

export const MidMarketPriceCard = (props: MidMarketPriceCardProps) => {
    return (
        <MidMarketPriceIndicatorWell>
            <MidMarketPriceText>{props.price.toString().slice(0, 12)}</MidMarketPriceText>
            <MidMarketPriceLabel>Mid market price</MidMarketPriceLabel>
        </MidMarketPriceIndicatorWell>
    );
};
