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
