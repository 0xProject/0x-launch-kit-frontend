import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import {
    goToHome,
    goToHomeLaunchpad,
    goToHomeMarginLend,
    goToWallet,
    logoutWallet,
    openFiatOnRampModal,
    openSideBar,
    setERC20Theme,
    setThemeName,
} from '../../../store/actions';
import { getEthAccount, getThemeName } from '../../../store/selectors';
import { getThemeFromConfigDex } from '../../../themes/theme_meta_data_utils';
import { connectToExplorer, viewOnFabrx } from '../../../util/external_services';
import { truncateAddress } from '../../../util/number_utils';
import { viewAddressOnEtherscan } from '../../../util/transaction_link';
import { WalletConnectionStatusDotStyled, WalletConnectionStatusText } from '../../account/wallet_connection_status';

const ListContainer = styled.ul`
    list-style-type: none;
    height: 100%;
    padding-left: 10px;
`;

const ListItem = styled.li`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    padding: 16px;
    cursor: pointer;
`;

const ListItemFlex = styled(ListItem)`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    padding: 16px;
    cursor: pointer;
    display: flex;
`;

const MenuContainer = styled.div`
    height: 100%;
    z-index: 1000;
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
    width: 250px;
`;

export const MobileWalletConnectionContent = () => {
    const ethAccount = useSelector(getEthAccount);
    const themeName = useSelector(getThemeName);
    const dispatch = useDispatch();

    const openFabrx = () => {
        viewOnFabrx(ethAccount);
    };

    const handleThemeClick = () => {
        const themeN = themeName === 'DARK_THEME' ? 'LIGHT_THEME' : 'DARK_THEME';
        dispatch(setThemeName(themeN));
        const theme = getThemeFromConfigDex(themeN);
        dispatch(setERC20Theme(theme));
    };

    const onGoToHome = () => {
        dispatch(goToHome());
        dispatch(openSideBar(false));
    };

    const onGoToLaunchpad = () => {
        dispatch(goToHomeLaunchpad());
        dispatch(openSideBar(false));
    };

    const onGoToMarginLend = () => {
        dispatch(goToHomeMarginLend());
        dispatch(openSideBar(false));
    };

    const onGoToWallet = () => {
        dispatch(goToWallet());
        dispatch(openSideBar(false));
    };

    const viewAccountExplorer = () => {
        viewAddressOnEtherscan(ethAccount);
    };

    const onClickFiatOnRampModal = () => {
        dispatch(openFiatOnRampModal(true));
        dispatch(openSideBar(false));
    };

    const onLogoutWallet = () => {
        dispatch(logoutWallet());
    };
    const status: string = ethAccount ? 'active' : '';

    const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';
    let tooltipTextRef: any;
    const afterShowTooltip = (evt: any) => {
        setTimeout(() => {
            ReactTooltip.hide(tooltipTextRef);
        }, 300);
    };

    return (
        <MenuContainer>
            <ListContainer>
                <ListItem onClick={onGoToHome}>Home</ListItem>
                <ListItem onClick={onGoToWallet}>Wallet</ListItem>
                <ListItem onClick={onGoToLaunchpad}>Launchpad</ListItem>
                <ListItem onClick={onGoToMarginLend}>Lend</ListItem>
                <hr />
                <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                    <ListItemFlex>
                        <WalletConnectionStatusDotStyled status={status} />
                        <WalletConnectionStatusText
                            ref={ref => (tooltipTextRef = ref)}
                            data-tip={'Copied To Clipboard'}
                        >
                            {ethAccountText}
                        </WalletConnectionStatusText>
                        <ReactTooltip afterShow={afterShowTooltip} />
                    </ListItemFlex>
                </CopyToClipboard>
                <ListItem onClick={onClickFiatOnRampModal}>Buy ETH</ListItem>
                <ListItem onClick={handleThemeClick}>{themeName === 'DARK_THEME' ? '☼' : '🌑'}</ListItem>
                <ListItem onClick={viewAccountExplorer}>View Address on Etherscan</ListItem>
                <ListItem onClick={connectToExplorer}>Track DEX volume</ListItem>
                <ListItem onClick={openFabrx}>Set Alerts</ListItem>
                <ListItem onClick={onLogoutWallet}>Logout Wallet</ListItem>
            </ListContainer>
        </MenuContainer>
    );
};
