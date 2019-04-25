import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as InstallMetamaskSvg } from '../../assets/icons/install_metamask.svg';
import { getThemeColors, getThemeModalsColors } from '../../store/selectors';
import { BasicThemeModal } from '../../themes/modal/BasicThemeModal';
import { errorsWallet } from '../../util/error_messages';
import { ModalDisplay, StoreState, StyledComponentThemeProps } from '../../util/types';

import { Button } from './button';
import { CloseModalButton } from './icons/close_modal_button';

interface OwnProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    closeModal: any;
    noMetamaskType: ModalDisplay;
    connectWallet: () => any;
}

interface StateProps extends StyledComponentThemeProps {
    themeModalColorsConfig: BasicThemeModal;
}

type Props = OwnProps & StateProps;

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 310px;
`;

const ModalTitle = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalText = styled.p`
    color: #666;
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
    color: #999;
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
    color: #fff;
    text-decoration: none;
`;

const MetamaskErrorModal: React.FC<Props> = props => {
    const { isOpen, closeModal, noMetamaskType, connectWallet, themeModalColorsConfig, themeColors } = props;
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
            <ButtonStyled theme="tertiary" themeColors={themeColors}>
                <LinkButton
                    target="_blank"
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                >
                    Get Chrome Extension
                </LinkButton>
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
            <ButtonStyled theme="tertiary" themeColors={themeColors}>
                <LinkButton onClick={connectWallet}>{errorsWallet.mmConnect}</LinkButton>
            </ButtonStyled>
        </>
    );

    return (
        <Modal isOpen={isOpen} style={themeModalColorsConfig}>
            <CloseModalButton onClick={closeModal} />
            <ModalContent>
                {noMetamaskType === ModalDisplay.EnablePermissions
                    ? metamaskNoPermissionsContent
                    : metamaskNotInstalledContent}
            </ModalContent>
        </Modal>
    );
};

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeModalColorsConfig: getThemeModalsColors(state),
        themeColors: getThemeColors(state),
    };
};

const MetamaskErrorModalContainer = connect(mapStateToProps)(MetamaskErrorModal);

export { MetamaskErrorModal, MetamaskErrorModalContainer };
