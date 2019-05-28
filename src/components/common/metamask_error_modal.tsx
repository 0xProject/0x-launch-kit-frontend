import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled, { withTheme } from 'styled-components';

import { ReactComponent as InstallMetamaskSvg } from '../../assets/icons/install_metamask.svg';
import { METAMASK_CHROME_EXTENSION_DOWNLOAD_URL } from '../../common/constants';
import { Theme } from '../../themes/commons';
import { errorsWallet } from '../../util/error_messages';
import { ButtonVariant, ModalDisplay } from '../../util/types';

import { Button } from './button';
import { CloseModalButton } from './icons/close_modal_button';

interface OwnProps {
    theme: Theme;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {
    isOpen: boolean;
    closeModal: any;
    noMetamaskType: ModalDisplay;
    connectWallet: () => any;
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

const ModalText = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0 0 25px;
    padding: 0;
    text-align: center;

    &:last-child {
        margin-bottom: 0;
    }
`;

const ModalTextLink = styled.a`
    color: ${props => props.theme.componentsTheme.textLight};
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 62px;
    justify-content: center;
    margin-bottom: 30px;

    svg {
        height: 52px;
        width: 52px;
    }
`;

const ButtonStyled = styled(Button)`
    width: 100%;
`;

const LinkButton = styled.a`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
`;

const MetamaskErrorModalContainer: React.FC<Props> = props => {
    const { isOpen, closeModal, noMetamaskType, connectWallet, theme } = props;

    const getMetamask = () => {
        window.open(METAMASK_CHROME_EXTENSION_DOWNLOAD_URL, '_blank');
    };

    const metamaskNotInstalledContent = (
        <>
            <ModalTitle>Install Metamask</ModalTitle>
            <IconContainer>
                <InstallMetamaskSvg />
            </IconContainer>
            <ModalText>Please install the MetaMask wallet extension from the Chrome Store.</ModalText>
            <ModalText>
                <ModalTextLink href="https://metamask.io/" target="_blank">
                    What is MetaMask?
                </ModalTextLink>
            </ModalText>
            <ButtonStyled onClick={getMetamask} variant={ButtonVariant.Tertiary}>
                <LinkButton>Get Chrome Extension</LinkButton>
            </ButtonStyled>
        </>
    );

    const metamaskNoPermissionsContent = (
        <>
            <ModalTitle>Connect Metamask</ModalTitle>
            <IconContainer>
                <InstallMetamaskSvg />
            </IconContainer>
            <ModalText>Please accept the MetaMask wallet permissions in order to access your wallet.</ModalText>
            <ModalText>
                <ModalTextLink href="https://metamask.io/" target="_blank">
                    What is MetaMask?
                </ModalTextLink>
            </ModalText>
            <ButtonStyled onClick={connectWallet} variant={ButtonVariant.Tertiary}>
                <LinkButton>{errorsWallet.mmConnect}</LinkButton>
            </ButtonStyled>
        </>
    );

    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={closeModal} />
            <ModalContent>
                {noMetamaskType === ModalDisplay.EnablePermissions
                    ? metamaskNoPermissionsContent
                    : metamaskNotInstalledContent}
            </ModalContent>
        </Modal>
    );
};

const MetamaskErrorModal = withTheme(MetamaskErrorModalContainer);

export { MetamaskErrorModal };
