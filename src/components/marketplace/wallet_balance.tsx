import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { themeColors } from '../../util/theme';
import { Card } from '../common/card';
import { Tooltip } from '../common/tooltip';

const LabelTitleWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 0 0 8px 0;
`;

const LabelTitle = styled.span`
    color: ${themeColors.lightGray};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: normal;
    text-transform: uppercase;
`;

const LabelWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 8px 0;

    &:last-child {
        padding-bottom: 0;
    }
`;

const Label = styled.span`
    align-items: center;
    color: #000;
    display: flex;
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.2;
`;

const Value = styled.span`
    color: #000;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
    text-align: right;
    white-space: nowrap;
`;

const WalletStatusBadge = styled.div<{ walletStatus?: any }>`
    background-color: ${props =>
        props.walletStatus === WalletStatus.Ok ? themeColors.green : themeColors.errorButtonBackground};
    border-radius: 50%;
    height: 8px;
    margin-right: 6px;
    width: 8px;
`;

const WalletStatusTitle = styled.h3`
    color: ${themeColors.textLight};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    text-align: right;
`;

const WalletStatusContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const TooltipStyled = styled(Tooltip)`
    margin-left: 10px;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {}

enum WalletStatus {
    Ok = 1,
    NotConnected = 2,
    NoWallet = 3,
}

const getWalletStatus = () => {
    return WalletStatus.Ok;
};

const getWalletName = () => {
    return 'MetaMask';
};

const getWallet = () => {
    return (
        <WalletStatusContainer>
            <WalletStatusBadge walletStatus={getWalletStatus()} />
            <WalletStatusTitle>{getWalletName()}</WalletStatusTitle>
        </WalletStatusContainer>
    );
};

const getWalletTitle = () => {
    return 'Wallet Balance';
};

const getWalletContent = () => {
    let content: any;

    content = (
        <>
            <LabelTitleWrapper>
                <LabelTitle>Token</LabelTitle>
                <LabelTitle>Amount</LabelTitle>
            </LabelTitleWrapper>
            <LabelWrapper>
                <Label>ZRX</Label>
                <Value>233.344</Value>
            </LabelWrapper>
            <LabelWrapper>
                <Label>
                    ETH <TooltipStyled type="full" />
                </Label>
                <Value>10.00</Value>
            </LabelWrapper>
        </>
    );

    return content;
};

export const WalletBalance: React.FC<Props> = props => {
    return (
        <Card title={getWalletTitle()} action={getWallet()}>
            {getWalletContent()}
        </Card>
    );
};
