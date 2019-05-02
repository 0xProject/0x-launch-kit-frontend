import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { goToHome, goToMyCollectibles } from '../../store/actions';
import { getWeb3State } from '../../store/selectors';
import { themeBreakPoints, themeColors, themeDimensions } from '../../themes/commons';
import { errorsWallet } from '../../util/error_messages';
import { StoreState, Web3State } from '../../util/types';
import { WalletConnectionStatusContainer } from '../account';
import { NotificationsDropdownContainer } from '../notifications/notifications_dropdown';

import { ErrorCard, ErrorIcons, FontSize } from './error_card';
import { LogoErc721 } from './logo_erc721';

interface StateProps {
    web3State?: Web3State;
}

interface DispatchProps {
    onGoToHome: () => any;
    onGoToMyCollectibles: () => any;
}

type Props = StateProps & DispatchProps;

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
    border-bottom: 1px solid ${themeColors.borderColor};
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    height: 64px;
    justify-content: space-between;
    padding: 0 ${themeDimensions.horizontalPadding};
    position: sticky;
    z-index: 123;
`;

const MyCollectibles = styled.a`
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

const LogoHeader = styled(LogoErc721)`
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

const ToolbarErc721 = (props: Props) => {
    const isMmLocked = props.web3State === Web3State.Locked;
    const isMmNotInstalled = props.web3State === Web3State.NotInstalled;
    const isMmLoading = props.web3State === Web3State.Loading;

    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };

    const handleMyCollectiblesClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToMyCollectibles();
    };

    return (
        <ToolbarWrapper>
            <ToolbarStart>
                <LogoHeader onClick={handleLogoClick} />
            </ToolbarStart>
            {isMmLocked ? (
                <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLocked} icon={ErrorIcons.Lock} />
            ) : null}
            {isMmNotInstalled ? (
                <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmNotInstalled} icon={ErrorIcons.Metamask} />
            ) : null}
            {isMmLoading ? (
                <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLoading} icon={ErrorIcons.Metamask} />
            ) : null}
            {!isMmLocked && !isMmNotInstalled && !isMmLoading ? (
                <ToolbarEnd>
                    <MyCollectibles href="/my-collectibles" onClick={handleMyCollectiblesClick}>
                        My Collectibles
                    </MyCollectibles>
                    <WalletDropdown />
                    <NotificationsDropdownContainer />
                </ToolbarEnd>
            ) : null}
        </ToolbarWrapper>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onGoToMyCollectibles: () => dispatch(goToMyCollectibles()),
    };
};

const ToolbarErc721Container = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ToolbarErc721);

export { ToolbarErc721, ToolbarErc721Container };
