import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as LogoSvg } from '../../../assets/icons/erc20_logo.svg';
import { Logo } from '../../../components/common/logo';
import { separatorTopbar, ToolbarContainer } from '../../../components/common/toolbar';
import { NotificationsDropdownContainer } from '../../../components/notifications/notifications_dropdown';
import { goToHomeErc20, goToWallet } from '../../../store/actions';
import { themeBreakPoints } from '../../../themes/commons';
import { WalletConnectionStatusContainer } from '../account/wallet_connection_status';

import { MarketsDropdownContainer } from './markets_dropdown';

interface DispatchProps {
    onGoToHome: () => any;
    onGoToWallet: () => any;
}

type Props = DispatchProps;

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

const ToolbarContent = (props: Props) => {
    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };
    const startContent = (
        <>
            <LogoHeader text="Launch Kit" image={<LogoSvg />} onClick={handleLogoClick} />
            <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
        </>
    );

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToWallet();
    };
    const endContent = (
        <>
            <MyWalletLink href="/my-wallet" onClick={handleMyWalletClick}>
                My Wallet
            </MyWalletLink>
            <WalletDropdown />
            <NotificationsDropdownContainer />
        </>
    );

    return <ToolbarContainer startContent={startContent} endContent={endContent} />;
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHomeErc20()),
        onGoToWallet: () => dispatch(goToWallet()),
    };
};

const ToolbarContentContainer = connect(
    null,
    mapDispatchToProps,
)(ToolbarContent);

export { ToolbarContent, ToolbarContentContainer };
