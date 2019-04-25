import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToHome, goToWallet } from '../../store/actions';
import { getThemeColors, getWeb3State } from '../../store/selectors';
import { BasicTheme } from '../../themes/BasicTheme';
import { themeBreakPoints, themeDimensions } from '../../themes/ThemeCommons';
import { errorsWallet } from '../../util/error_messages';
import { StoreState, Web3State } from '../../util/types';
import { WalletConnectionStatusContainer } from '../account';
import { NotificationsDropdownContainer } from '../notifications/notifications_dropdown';

import { ErrorCard, ErrorIcons, FontSize } from './error_card';
import { Logo } from './logo';
import { MarketsDropdownContainer } from './markets_dropdown';

interface StateProps {
    web3State?: Web3State;
    themeColorsConfig: BasicTheme;
}

interface DispatchProps {
    onGoToHome: () => any;
    onGoToWallet: () => any;
}

type Props = StateProps & DispatchProps;

const separatorTopbar = styled.div<{ themeColors: BasicTheme }>`
    &:after {
        background-color: ${props => props.themeColors.borderColor};
        content: '';
        height: 26px;
        margin-left: 17px;
        margin-right: 17px;
        width: 1px;
    }

    &:last-child:after {
        display: none;
    }
`;

const ToolbarWrapper = styled.div<{ themeColors: BasicTheme }>`
    align-items: center;
    background: #ffffff;
    border-bottom: 1px solid ${props => props.themeColors.borderColor};
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

const Toolbar = (props: Props) => {
    const isMmLocked = props.web3State === Web3State.Locked;
    const isMmNotInstalled = props.web3State === Web3State.NotInstalled;
    const isMmLoading = props.web3State === Web3State.Loading;
    const { themeColorsConfig } = props;

    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToWallet();
    };

    return (
        <ToolbarWrapper themeColors={themeColorsConfig}>
            <ToolbarStart>
                <LogoHeader onClick={handleLogoClick} />
                <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
            </ToolbarStart>
            {isMmLocked ? (
                <ErrorCard
                    fontSize={FontSize.Large}
                    text={errorsWallet.mmLocked}
                    icon={ErrorIcons.Lock}
                    themeColors={themeColorsConfig}
                />
            ) : null}
            {isMmNotInstalled ? (
                <ErrorCard
                    fontSize={FontSize.Large}
                    text={errorsWallet.mmNotInstalled}
                    icon={ErrorIcons.Metamask}
                    themeColors={themeColorsConfig}
                />
            ) : null}
            {isMmLoading ? (
                <ErrorCard
                    fontSize={FontSize.Large}
                    text={errorsWallet.mmLoading}
                    icon={ErrorIcons.Metamask}
                    themeColors={themeColorsConfig}
                />
            ) : null}
            {!isMmLocked && !isMmNotInstalled && !isMmLoading ? (
                <ToolbarEnd>
                    <MyWalletLink href="/my-wallet" onClick={handleMyWalletClick}>
                        My Wallet
                    </MyWalletLink>
                    <WalletDropdown themeColors={themeColorsConfig} />
                    <NotificationsDropdownContainer />
                </ToolbarEnd>
            ) : null}
        </ToolbarWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        themeColorsConfig: getThemeColors(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onGoToWallet: () => dispatch(goToWallet()),
    };
};

const ToolbarContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toolbar);

export { Toolbar, ToolbarContainer };
