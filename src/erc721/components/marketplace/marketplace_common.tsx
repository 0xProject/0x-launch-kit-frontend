import styled from 'styled-components';

export const TitleText = styled.h3`
    font-size: 14px;
    line-height: 17px;
    font-weight: 500;
`;

export enum AssetOrderType {
    Buy = 'BUY',
    Sell = 'SELL',
    Cancel = 'CANCEL',
}

// TODO - remove once the my collectibles page and the store is ready
export interface Collectible {
    name: string;
    price: string;
    color: string;
    image: string;
    assetId: string;
    description: string;
    currentOwner: string;
    assetUrl: string;
}
