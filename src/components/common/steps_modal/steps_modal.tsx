import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { stepsModalReset } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { themeModalStyle } from '../../../util/theme';
import { Step, StepKind, StoreState } from '../../../util/types';
import { CloseModalButton } from '../../common/icons/close_modal_button';

import { BuySellTokenStepContainer } from './buy_sell_token_step';
import { SignOrderStepContainer } from './sign_order_step';
import { ModalContent, ModalStatusText, ModalStatusTextLight, StepsTimeline } from './steps_common';
import { StepItem } from './steps_progress';
import { UnlockTokensStepContainer } from './unlock_token_step';
import { WrapEthStepContainer } from './wrap_eth_step';

interface StateProps {
    currentStep: Step | null;
}

interface DispatchProps {
    reset: () => void;
}

type Props = StateProps & DispatchProps;

const CloseButtonContainer = styled.div`
    align-items: center;
    display: flex;
    height: 20px;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: -10px;
`;

const steps: StepItem[] = [
    {
        active: true,
        progress: '100',
        title: 'Unlock',
    },
    {
        active: true,
        progress: '30',
        title: 'Some words',
    },
    {
        active: false,
        progress: '0',
        title: 'Finish',
    },
];

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { currentStep, reset } = this.props;
        const isOpen = currentStep !== null;
        return (
            <Modal isOpen={isOpen} style={themeModalStyle}>
                <CloseButtonContainer>
                    <CloseModalButton onClick={reset} />
                </CloseButtonContainer>
                <ModalContent>
                    {currentStep && currentStep.kind === StepKind.UnlockToken && <UnlockTokensStepContainer />}
                    {currentStep && currentStep.kind === StepKind.BuySellLimit && <SignOrderStepContainer />}
                    {currentStep && currentStep.kind === StepKind.BuySellMarket && <BuySellTokenStepContainer />}
                    {currentStep && currentStep.kind === StepKind.WrapEth && <WrapEthStepContainer />}

                    <StepsTimeline steps={steps} />
                    <ModalStatusText>
                        Current status, time <ModalStatusTextLight>00:34s...</ModalStatusTextLight>
                    </ModalStatusText>
                </ModalContent>
            </Modal>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        currentStep: getStepsModalCurrentStep(state),
    };
};

const StepsModalContainer = connect(
    mapStateToProps,
    {
        reset: stepsModalReset,
    },
)(StepsModal);

export { StepsModal, StepsModalContainer };
