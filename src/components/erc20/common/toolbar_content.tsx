import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { UI_GENERAL_TITLE } from '../../../common/constants';
import { Logo } from '../../../components/common/logo';
import { separatorTopbar, ToolbarContainer } from '../../../components/common/toolbar';
import { NotificationsDropdownContainer } from '../../../components/notifications/notifications_dropdown';
import {
    goToHome,
    goToWallet,
    openFiatOnRampChooseModal,
    openSideBar,
    setERC20Theme,
    setThemeName,
} from '../../../store/actions';
import { getGeneralConfig, getThemeName } from '../../../store/selectors';
import { Theme, themeBreakPoints } from '../../../themes/commons';
import { getThemeFromConfigDex } from '../../../themes/theme_meta_data_utils';
import { isMobile } from '../../../util/screen';
import { Button } from '../../common/button';
import { withWindowWidth } from '../../common/hoc/withWindowWidth';
import { LogoIcon } from '../../common/icons/logo_icon';
import { MenuBurguer } from '../../common/icons/menu_burguer';
import { WalletConnectionContentContainer } from '../account/wallet_connection_content';

import { MarketsDropdownContainer } from './markets_dropdown';

interface DispatchProps {
    onGoToHome: () => any;
    onGoToWallet: () => any;
}

interface OwnProps {
    theme: Theme;
    windowWidth: number;
}

type Props = DispatchProps & OwnProps;

const MyWalletLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
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

const WalletDropdown = styled(WalletConnectionContentContainer)`
    display: none;

    @media (min-width: ${themeBreakPoints.sm}) {
        align-items: center;
        display: flex;

        ${separatorTopbar}
    }
`;

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.componentsTheme.topbarBackgroundColor};
    color: ${props => props.theme.componentsTheme.textColorCommon};
    &:hover {
        text-decoration: underline;
    }
`;

const MenuStyledButton = styled(Button)`
    background-color: ${props => props.theme.componentsTheme.topbarBackgroundColor};
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const StyledMenuBurguer = styled(MenuBurguer)`
    fill: ${props => props.theme.componentsTheme.textColorCommon};
`;

const ToolbarContent = (props: Props) => {
    const handleLogoClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToHome();
    };
    const generalConfig = useSelector(getGeneralConfig);
    const themeName = useSelector(getThemeName);
    const logo = generalConfig && generalConfig.icon ? <LogoIcon icon={generalConfig.icon} /> : null;
    const dispatch = useDispatch();
    const setOpenSideBar = () => {
        dispatch(openSideBar(true));
    };
    const handleThemeClick = () => {
        const themeN = themeName === 'DARK_THEME' ? 'LIGHT_THEME' : 'DARK_THEME';
        dispatch(setThemeName(themeN));
        const theme = getThemeFromConfigDex(themeN);
        dispatch(setERC20Theme(theme));
    };
    const handleFiatChooseModal = () => {
        dispatch(openFiatOnRampChooseModal(true));
    };

    let startContent;
    if (isMobile(props.windowWidth)) {
        startContent = (
            <>
                <MenuStyledButton onClick={setOpenSideBar}>
                    <StyledMenuBurguer />
                </MenuStyledButton>
                <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} />
            </>
        );
    } else {
        startContent = (
            <>
                <LogoHeader
                    image={logo}
                    onClick={handleLogoClick}
                    text={(generalConfig && generalConfig.title) || UI_GENERAL_TITLE}
                    textColor={props.theme.componentsTheme.logoERC20TextColor}
                />
                <MarketsDropdownHeader shouldCloseDropdownBodyOnClick={false} className={'markets-dropdown'} />
            </>
        );
    }

    const handleMyWalletClick: React.EventHandler<React.MouseEvent> = e => {
        e.preventDefault();
        props.onGoToWallet();
    };
    let endContent;
    if (isMobile(props.windowWidth)) {
        endContent = (
            <>
                <NotificationsDropdownContainer />
            </>
        );
    } else {
        endContent = (
            <>
                <StyledButton onClick={handleThemeClick} className={'theme-switcher'}>
                    {themeName === 'DARK_THEME' ? '☼' : '🌑'}
                </StyledButton>
                <StyledButton onClick={handleFiatChooseModal} className={'buy-eth'}>
                    Buy ETH
                </StyledButton>
                <MyWalletLink href="/my-wallet" onClick={handleMyWalletClick} className={'my-wallet'}>
                    My Wallet
                </MyWalletLink>
                <WalletDropdown className={'wallet-dropdown'} />
                <NotificationsDropdownContainer className={'notifications'} />
            </>
        );
    }

    return <ToolbarContainer startContent={startContent} endContent={endContent} />;
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onGoToWallet: () => dispatch(goToWallet()),
    };
};

const ToolbarContentContainer = withWindowWidth(
    withTheme(
        connect(
            null,
            mapDispatchToProps,
        )(ToolbarContent),
    ),
);

export { ToolbarContent, ToolbarContentContainer as default };
