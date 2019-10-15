import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled, { withTheme } from 'styled-components';

import { METAMASK_CHROME_EXTENSION_DOWNLOAD_URL } from '../../common/constants';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { Theme } from '../../themes/commons';
import { envUtil } from '../../util/env';
import { ButtonVariant, Wallet } from '../../util/types';

import { Button } from './button';
import { CloseModalButton } from './icons/close_modal_button';
import { GetCoinbaseWallet } from './icons/coinbase_wallet_get';

interface OwnProps {
    theme: Theme;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {
    isOpen: boolean;
    closeModal: any;
    chooseWallet: (wallet: Wallet) => any;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    width: 310px;
`;

const ModalTitle = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalTextLink = styled.a`
    color: ${props => props.theme.componentsTheme.textLight};
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
`;

const ButtonStyled = styled(Button)`
    width: 100%;
    margin: 10px;
`;

const ButtonCoinbase = styled(Button)`
    width: 100%;
    margin: 10px;
    background-color: ${props => props.theme.componentsTheme.cardBackgroundColor};
`;

const LinkButton = styled.a`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
`;

const MobileText = styled.p`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
    text-align: left;
`;

const WalletChooseModalContainer: React.FC<Props> = props => {
    const { isOpen, closeModal, chooseWallet, theme } = props;

    const isMMInstalled = () => isMetamaskInstalled();
    // TODO: Enable and disable wallets
    //   const wallets = Config.getConfig().wallets;
    const getMetamask = () => {
        window.open(METAMASK_CHROME_EXTENSION_DOWNLOAD_URL, '_blank');
    };

    const choosePortis = () => {
        chooseWallet(Wallet.Portis);
    };
    const chooseMetamask = () => {
        chooseWallet(Wallet.Metamask);
    };
    /*const chooseWalletTorus = () => {
        chooseWallet(Wallet.Torus);
    };*/
    const chooseFortmatic = () => {
        chooseWallet(Wallet.Fortmatic);
    };
    const clickGetCoinbaseWallet = () => {
        const os = envUtil.getOperatingSystem();
        switch (os) {
            case 'android':
                window.open('https://play.google.com/store/apps/details?id=org.toshi');
                break;
            case 'ios':
                window.open('https://itunes.apple.com/app/coinbase-wallet/id1278383455?ls=1&mt=8');
                break;
            default:
                window.open('https://play.google.com/store/apps/details?id=org.toshi');
                break;
        }
    };

    const isMobile = envUtil.isMobileOperatingSystem();

    const content = (
        <>
            <ModalTitle>Choose Wallet:</ModalTitle>
            <ButtonStyled onClick={choosePortis} variant={ButtonVariant.Portis}>
                <LinkButton>{'Portis'}</LinkButton>
            </ButtonStyled>
            <ButtonStyled onClick={chooseFortmatic} variant={ButtonVariant.Fortmatic}>
                <LinkButton>{'Fortmatic'}</LinkButton>
            </ButtonStyled>
            {/*<ButtonStyled  onClick={chooseWalletTorus} variant={ButtonVariant.Torus}>
                <LinkButton>{'Torus'}</LinkButton>
               </ButtonStyled>*/}
            {/*isMMInstalled() ? <ModalTextLink>Torus not work with Metamask installed! </ModalTextLink> : ''*/}
            {!isMobile && (
                <ButtonStyled disabled={!isMMInstalled()} onClick={chooseMetamask} variant={ButtonVariant.Tertiary}>
                    <LinkButton>{'Metamask'}</LinkButton>
                </ButtonStyled>
            )}

            {isMMInstalled() || isMobile ? (
                ''
            ) : (
                <ModalTextLink onClick={getMetamask}>Metamask not installed! Get Metamask</ModalTextLink>
            )}

            {isMobile ? (
                <>
                    <MobileText>Mobile Wallets With Dapp Browsers</MobileText>
                    <ButtonCoinbase onClick={clickGetCoinbaseWallet}>{GetCoinbaseWallet()}</ButtonCoinbase>
                </>
            ) : (
                ''
            )}
        </>
    );

    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={closeModal} />
            <ModalContent>{content}</ModalContent>
        </Modal>
    );
};

const WalletChooseModal = withTheme(WalletChooseModalContainer);

export { WalletChooseModal };
