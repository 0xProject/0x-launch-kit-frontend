import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { errorsWallet } from '../../util/error_messages';
import { themeColors } from '../../util/theme';
import { Card } from '../common/card';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';
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

const ErrorCardStyled = styled(ErrorCard)`
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 5;
`;

const WalletErrorContainer = styled.div`
    height: 140px;
    position: relative;
`;

const WalletErrorFiller = styled.div<{ top?: string; bottom?: string; left?: string; right?: string }>`
    ${props => (props.bottom ? `bottom: ${props.bottom};` : '')}
    ${props => (props.left ? `left: ${props.left};` : '')}
    ${props => (props.right ? `right: ${props.right};` : '')}
    ${props => (props.top ? `top: ${props.top};` : '')}
    position: absolute;
    z-index: 1;
`;

interface Props extends HTMLAttributes<HTMLDivElement> {}

enum WalletStatus {
    Ok = 1,
    NotConnected = 2,
    NoWallet = 3,
}

const fillerBig = () => {
    return (
        <svg width="67" height="14" viewBox="0 0 67 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="67" height="14" rx="4" fill="#F9F9F9" />
        </svg>
    );
};

const fillerSmall = () => {
    return (
        <svg width="56" height="14" viewBox="0 0 56 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="14" rx="4" fill="#F9F9F9" />
        </svg>
    );
};

const getWalletStatus = () => {
    // return WalletStatus.Ok;
    return WalletStatus.NotConnected;
    // return WalletStatus.NoWallet;
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
    let content: any = null;

    if (getWalletStatus() === WalletStatus.Ok) {
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
    }

    if (getWalletStatus() === WalletStatus.NotConnected) {
        content = (
            <WalletErrorContainer>
                <ErrorCardStyled
                    fontSize={FontSize.Large}
                    icon={ErrorIcons.Lock}
                    text={errorsWallet.mmConnect}
                    textAlign="center"
                />
                <WalletErrorFiller top="0" left="0">
                    {fillerBig()}
                </WalletErrorFiller>
                <WalletErrorFiller top="0" right="0">
                    {fillerBig()}
                </WalletErrorFiller>
                <WalletErrorFiller bottom="0" left="0">
                    {fillerSmall()}
                </WalletErrorFiller>
                <WalletErrorFiller bottom="0" right="0">
                    {fillerSmall()}
                </WalletErrorFiller>
            </WalletErrorContainer>
        );
    }

    return content;
};

export const WalletBalance: React.FC<Props> = props => {
    return (
        <Card title={getWalletTitle()} action={getWallet()}>
            {getWalletContent()}
        </Card>
    );
};
