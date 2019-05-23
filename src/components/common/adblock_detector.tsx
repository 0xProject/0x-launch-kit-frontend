import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled, { withTheme } from 'styled-components';

import { ReactComponent as RedExclamationSign } from '../../assets/icons/red_exclamation_sign.svg';
import { LocalStorage } from '../../services/local_storage';
import { Theme } from '../../themes/commons';

import { CloseModalButton } from './icons/close_modal_button';

interface State {
    isOpen: boolean;
}

interface OwnProps {
    theme: Theme;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {}

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
    margin: 0 0 15px;
    padding: 0 20px;
    text-align: center;
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 155px;
    justify-content: center;
    margin: 0 0 15px;

    svg {
        height: 48px;
        width: 48px;
    }
`;

const localStorage = new LocalStorage(window.localStorage);

class AdBlockDetectorContainer extends React.Component<Props, State> {
    public readonly state: State = {
        isOpen: false,
    };

    public componentDidMount = async () => {
        const wasAdBlockMessageShown = localStorage.getAdBlockMessageShown();
        if (!wasAdBlockMessageShown) {
            this.setState({ isOpen: await this.detectAdBlock() });
            localStorage.saveAdBlockMessageShown(true);
        }
    };

    public detectAdBlock = () => {
        return new Promise<boolean>((resolve, reject) => {
            // Creates a bait for ad block
            const elem = document.createElement('div');

            elem.className = 'adclass';
            document.body.appendChild(elem);

            let isAdBlockDetected;

            window.setTimeout(() => {
                isAdBlockDetected = !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
                resolve(isAdBlockDetected);
            }, 0);
        });
    };

    public closeModal = () => {
        this.setState({ isOpen: false });
    };

    public render = () => {
        return (
            <Modal isOpen={this.state.isOpen} style={this.props.theme.modalTheme}>
                <CloseModalButton onClick={this.closeModal} />
                <ModalContent>
                    <ModalTitle>Ad Blocker Detected</ModalTitle>
                    <IconContainer>
                        <RedExclamationSign />
                    </IconContainer>
                    <ModalText>This dApp may not work correctly with your ad blocker enabled</ModalText>
                </ModalContent>
            </Modal>
        );
    };
}

const AdBlockDetector = withTheme(AdBlockDetectorContainer);

export { AdBlockDetector };
