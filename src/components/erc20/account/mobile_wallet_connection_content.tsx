import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { goToHome, goToWallet, logoutWallet, openFiatOnRampModal, openSideBar } from '../../../store/actions';
import { getEthAccount } from '../../../store/selectors';
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
    color: white;
    padding: 16px;
    cursor: pointer;
`;

const ListItemFlex = styled(ListItem)`
    color: white;
    padding: 16px;
    cursor: pointer;
    display: flex;
`;

const MenuContainer = styled.div`
    height: 100%;
    z-index: 1000;
    background-color: black;
    width: 250px;
`;

export const MobileWalletConnectionContent = () => {
    const ethAccount = useSelector(getEthAccount);
    const dispatch = useDispatch();

    const openFabrx = () => {
        viewOnFabrx(ethAccount);
    };

    const onGoToHome = () => {
        dispatch(goToHome());
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
                <ListItem onClick={viewAccountExplorer}>View Address on Etherscan</ListItem>
                <ListItem onClick={connectToExplorer}>Track DEX volume</ListItem>
                <ListItem onClick={openFabrx}>Set Alerts</ListItem>
                <ListItem onClick={onLogoutWallet}>Logout Wallet</ListItem>
            </ListContainer>
        </MenuContainer>
    );
};
