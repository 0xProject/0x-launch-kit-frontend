import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { LocalStorage } from '../../services/local_storage';
import { themeModalStyle } from '../../util/theme';

import { CloseModalButton } from './icons/close_modal_button';

interface State {
    isOpen: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement> {}

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
    color: #000;
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

const stopIcon = () => {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2.14713 14.0331L1.08647 12.9724L2.14713 14.0331L14.0331 2.14714C14.4474 1.73278 15.0094 1.5 15.5954 1.5L32.4046 1.5C32.9906 1.5 33.5526 1.73278 33.9669 2.14713L45.8529 14.0331C46.2672 14.4474 46.5 15.0094 46.5 15.5954L46.5 32.4046C46.5 32.9906 46.2672 33.5526 45.8529 33.9669L33.9669 45.8529C33.5526 46.2672 32.9906 46.5 32.4046 46.5H15.5954C15.0094 46.5 14.4474 46.2672 14.0331 45.8529L12.9724 46.9135L14.0331 45.8529L2.14714 33.9669C1.73278 33.5526 1.5 32.9906 1.5 32.4046L1.5 15.5954C1.5 15.0094 1.73278 14.4474 2.14713 14.0331Z"
                stroke="#FF6534"
                stroke-width="3"
            />
            <path d="M24.5 15L24.5 27.5" stroke="#FF6534" stroke-width="3" stroke-linecap="round" />
            <circle cx="24.5" cy="33.5" r="1.5" fill="#FF6534" />
        </svg>
    );
};

const localStorage = new LocalStorage(window.localStorage);

class AdBlockDetector extends React.Component<Props, State> {
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
            <Modal isOpen={this.state.isOpen} style={themeModalStyle}>
                <CloseModalButton onClick={this.closeModal} />
                <ModalContent>
                    <ModalTitle>Ad Blocker Detected</ModalTitle>
                    <IconContainer>{stopIcon()}</IconContainer>
                    <ModalText>This dApp may not work correctly with your ad blocker enabled</ModalText>
                </ModalContent>
            </Modal>
        );
    };
}
export { AdBlockDetector };
