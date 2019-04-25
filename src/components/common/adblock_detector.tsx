import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as RedExclamationSign } from '../../assets/icons/red_exclamation_sign.svg';
import { LocalStorage } from '../../services/local_storage';
import { getThemeModalsColors } from '../../store/selectors';
import { StoreState, StyledComponentThemeModalProps } from '../../util/types';

import { CloseModalButton } from './icons/close_modal_button';

interface State {
    isOpen: boolean;
}

interface StateProps extends HTMLAttributes<HTMLDivElement>, StyledComponentThemeModalProps {}

type Props = StateProps;

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
        const { themeModalColors } = this.props;
        return (
            <Modal isOpen={this.state.isOpen} style={themeModalColors}>
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

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeModalColors: getThemeModalsColors(state),
    };
};

const AdBlockDetectorContainer = connect(mapStateToProps)(AdBlockDetector);

export { AdBlockDetector, AdBlockDetectorContainer };
