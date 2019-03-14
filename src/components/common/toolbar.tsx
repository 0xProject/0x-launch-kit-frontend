import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToHome, goToWallet } from '../../store/actions';
import { themeBreakPoints, themeColors, themeDimensions } from '../../util/theme';
import { WalletConnectionStatusContainer } from '../account';
import { NotificationsDropdownContainer } from '../notifications/notifications_dropdown';

import { Logo } from './logo';
import { MarketsDropdownContainer } from './markets_dropdown';
import { PriceChange } from './price_change';

interface Props {
    onGoToHome: () => any;
    onGoToWallet: () => any;
}

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

const MyWalletLink = styled.a`
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

const Toolbar = (props: Props) => {
    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToWallet();
    };

    return (
        <ToolbarWrapper>
            <ToolbarStart>
                <LogoHeader onClick={handleLogoClick} />
                <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
                <PriceChangeStyled />
            </ToolbarStart>
            <ToolbarEnd>
                <MyWalletLink href="/my-wallet" onClick={handleMyWalletClick}>
                    My Wallet
                </MyWalletLink>
                <WalletDropdown />
                <NotificationsDropdownContainer />
            </ToolbarEnd>
        </ToolbarWrapper>
    );
};

const mapDispatchToProps = {
    onGoToHome: goToHome,
    onGoToWallet: goToWallet,
};

const ToolbarContainer = connect(
    null,
    mapDispatchToProps,
)(Toolbar);

export { Toolbar, ToolbarContainer };
