import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { errorsWallet } from '../../util/error_messages';
import { themeBreakPoints, themeColors, themeDimensions } from '../../util/theme';
import { WalletConnectionStatusContainer } from '../account';
import { NotificationsDropdown } from '../account/notifications_dropdown';
import { ErrorCard, ErrorIcons, FontSize } from '../common/error_card';

import { Logo } from './logo';
import { MarketsDropdownContainer } from './markets_dropdown';
import { PriceChange } from './price_change';

const separatorTopbar = `
    &:after {
        background-color: ${themeColors.borderColor};
        content: "";
        height: 26px;
        margin-left: 17px;
        margin-right: 17px;
        width: 1px;
    }

    &:last-child:after {
        display: none;
    }
`;

const ToolbarWrapper = styled.div`
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: 64px;
    justify-content: space-between;
    padding: 0 ${themeDimensions.horizontalPadding};
    position: sticky;
    z-index: 123;
`;

const MyWalletLink = styled(Link)`
    align-items: center;
    color: #333333;
    display: flex;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }

    ${separatorTopbar}
`;

const ToolbarStart = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-start;
`;

const ToolbarEnd = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
`;

const LogoHeader = styled(Logo)`
    ${separatorTopbar}
`;

const MarketsDropdownHeader = styled<any>(MarketsDropdownContainer)`
    align-items: center;
    display: flex;

    ${separatorTopbar}
`;

const WalletDropdown = styled(WalletConnectionStatusContainer)`
    display: none;

    @media (min-width: ${themeBreakPoints.sm}) {
        align-items: center;
        display: flex;

        ${separatorTopbar}
    }
`;

const PriceChangeStyled = styled(PriceChange)`
    display: none;

    @media (min-width: ${themeBreakPoints.lg}) {
        display: flex;
    }
`;

export const Toolbar = () => {
    const mmLocked = false;
    const mmNotInstalled = false;

    return (
        <ToolbarWrapper>
            <ToolbarStart>
                <LogoHeader />
                <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
                <PriceChangeStyled />
            </ToolbarStart>
            {mmLocked ? (
                <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLocked} icon={ErrorIcons.Lock} />
            ) : null}
            {mmNotInstalled ? (
                <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmNotInstalled} icon={ErrorIcons.Metamask} />
            ) : null}
            {!mmLocked && !mmNotInstalled ? (
                <ToolbarEnd>
                    <MyWalletLink to="/my-wallet">My Wallet</MyWalletLink>
                    <WalletDropdown />
                    <NotificationsDropdown />
                </ToolbarEnd>
            ) : null}
        </ToolbarWrapper>
    );
};
