import React from 'react';
import styled from 'styled-components';

import { Card } from '../../../components/common/card';

import { TitleText } from './marketplace_common';

const DescriptionCard = styled(Card)`
    width: 586px;
    height: 218px;
`;

const DescriptionText = styled.p`
    color: #000;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
`;

const TransactionHistoryText = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: #0036f4;
`;

export const AssetDescriptionContainer = (props: any) => {
    return (
        <>
            <DescriptionCard>
                <h2>Vulcat</h2>
                <TitleText>Description</TitleText>
                <DescriptionText>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                    laoreet dolore magna aliquam.
                </DescriptionText>
                <TitleText>Current owner</TitleText>
                <DescriptionText>123152131</DescriptionText>
            </DescriptionCard>
            <DescriptionCard>
                <TitleText>Price Chart</TitleText>
                <TitleText>Current price</TitleText>
                <p>4.4 ETH</p>
                <TitleText>Time remaining</TitleText>
                <p>2 Days 8 hrs</p>
            </DescriptionCard>
            <DescriptionCard>
                <TitleText>Transaction history</TitleText>
                <TransactionHistoryText>Sold for </TransactionHistoryText>
                <TransactionHistoryText>Listed at</TransactionHistoryText>
                <TransactionHistoryText>Transfer</TransactionHistoryText>
                <TransactionHistoryText>Created</TransactionHistoryText>
            </DescriptionCard>
        </>
    );
};
