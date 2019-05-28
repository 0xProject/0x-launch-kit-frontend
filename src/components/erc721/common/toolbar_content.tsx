import React from 'react';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { ReactComponent as LogoSvg } from '../../../assets/icons/erc721_logo.svg';
import { goToHome, goToMyCollectibles } from '../../../store/router/actions';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { Logo } from '../../common/logo';
import { separatorTopbar, ToolbarContainer } from '../../common/toolbar';
import { NotificationsDropdownContainer } from '../../notifications/notifications_dropdown';
import { WalletConnectionContentContainer } from '../account/wallet_connection_content';
import { CollectiblesSearch } from '../collectibles/collectibles_search';

interface DispatchProps {
    onGoToHome: () => any;
    goToMyCollectibles: () => any;
}

interface OwnProps {
    theme: Theme;
}

type Props = DispatchProps & OwnProps;

const MyWalletLink = styled.a`
    align-items: center;
    color: #333;
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

const LogoSVGStyled = styled(LogoSvg)`
    path {
        fill: ${props => props.theme.componentsTheme.logoERC721Color};
    }
`;

const WalletDropdown = styled(WalletConnectionContentContainer)`
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
        <LogoHeader
            image={<LogoSVGStyled />}
            onClick={handleLogoClick}
            text="0x Collectibles"
            textColor={props.theme.componentsTheme.logoERC721TextColor}
        />
    );

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.goToMyCollectibles();
    };
    const endContent = (
        <>
            <MyWalletLink href="/my-collectibles" onClick={handleMyWalletClick}>
                My Collectibles
            </MyWalletLink>
            <WalletDropdown />
            <NotificationsDropdownContainer />
        </>
    );
    const centerContent = <CollectiblesSearch theme={props.theme} />;

    return <ToolbarContainer startContent={startContent} centerContent={centerContent} endContent={endContent} />;
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        goToMyCollectibles: () => dispatch(goToMyCollectibles()),
    };
};

const ToolbarContentContainer = withTheme(
    connect(
        null,
        mapDispatchToProps,
    )(ToolbarContent),
);

export { ToolbarContent, ToolbarContentContainer };
