import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { WalletConnectionStatusContainer } from '../../../components/account';
import { ErrorCard, ErrorIcons, FontSize } from '../../../components/common/error_card';
import { NotificationsDropdownContainer } from '../../../components/notifications/notifications_dropdown';
import { goToHomeErc721, goToMyCollectibles } from '../../../store/router/actions';
import { getWeb3State } from '../../../store/selectors';
import { themeBreakPoints, themeColors, themeDimensions } from '../../../themes/commons';
import { errorsWallet } from '../../../util/error_messages';
import { StoreState, Web3State } from '../../../util/types';

import { Search } from './inputSearch';
import { Logo } from './logo';

interface StateProps {
    web3State?: Web3State;
}

interface DispatchProps {
    onGoToHome: () => any;
    goToMyCollectibles: () => any;
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

    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.goToMyCollectibles();
    };

    return (
        <ToolbarWrapper>
            <ToolbarStart>
                <LogoHeader onClick={handleLogoClick} />
            </ToolbarStart>
            <Search />
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
                    <MyWalletLink href="/my-collectibles" onClick={handleMyWalletClick}>
                        My Collectibles
                    </MyWalletLink>
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
        onGoToHome: () => dispatch(goToHomeErc721()),
        goToMyCollectibles: () => dispatch(goToMyCollectibles()),
    };
};

const ToolbarContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Toolbar);

export { Toolbar, ToolbarContainer };
