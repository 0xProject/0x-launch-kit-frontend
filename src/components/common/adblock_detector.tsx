import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

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
    margin: 0 0 20px;
    padding: 0;
    text-align: center;

    &:last-child {
        margin-bottom: 0;
    }
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

const stopIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" version="1.1" viewBox="0 0 512 512">
            <path
                fill="#cc191e"
                d="m502.625,121.375l-112-112c-6-6-14.141-9.375-22.625-9.375h-224c-8.484,0-16.625,3.375-22.625,9.375l-112,112c-6,6-9.375,14.141-9.375,22.625v224c0,8.484 3.375,16.625 9.375,22.625l112,112c6,6 14.141,9.375 22.625,9.375h224c8.484,0 16.625-3.375 22.625-9.375l112-112c6-6 9.375-14.141 9.375-22.625v-224c0-8.484-3.375-16.625-9.375-22.625zm-134.625,118.621v112c0,35.348-34.262,64.004-69.609,64.004h-46.555c-30.305,0-58.004-17.121-71.555-44.225l-9.891-19.778-40.824-95.258c-4.027-9.402-0.031-20.313 9.113-24.887 8.91-4.453 22.547-1.406 27.824,7.039l25.497,36.304v-35.199-128c0-8.836 7.164-16 16-16s16,7.164 16,16v120c0,4.418 3.582,8 8,8s8-3.582 8-8v-152c0-8.836 7.164-16 16-16s16,7.164 16,16v152c0,4.418 3.582,8 8,8s8-3.582 8-8v-120c0-8.836 7.164-16 16-16s16,7.164 16,16v128 8c0,4.418 3.582,8 8,8s8-3.582 8-8v-8-80c0-8.836 7.164-16 16-16s16,7.164 16,16v80z"
            />
        </svg>
    );
};

class AdBlockDetector extends React.Component<Props, State> {
    public readonly state: State = {
        isOpen: false,
    };

    public componentDidMount = async () => {
        this.setState({ isOpen: await this.detectAdBlock() });
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
                    <ModalTitle>Ad Blocker Detected!</ModalTitle>
                    <IconContainer>{stopIcon()}</IconContainer>
                    <ModalText>We detected you are using an ad blocker.</ModalText>
                    <ModalText>Keep in mind that this dApp may not work correctly with it enabled.</ModalText>
                </ModalContent>
            </Modal>
        );
    };
}
export { AdBlockDetector };
