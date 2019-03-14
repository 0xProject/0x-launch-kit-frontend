import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { stepsModalReset } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { themeModalStyle } from '../../../util/theme';
import { Step, StepKind, StoreState } from '../../../util/types';
import { CloseModalButton } from '../../common/icons/close_modal_button';

import { BuySellTokenStepContainer } from './buy_sell_token_step';
import { SignOrderStepContainer } from './sign_order_step';
import { ModalContent } from './steps_common';
import { UnlockTokensStepContainer } from './unlock_token_step';
import { WrapEthStepContainer } from './wrap_eth_step';

interface StateProps {
    currentStep: Step | null;
}

interface DispatchProps {
    reset: () => void;
}

type Props = StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { currentStep, reset } = this.props;
        const isOpen = currentStep !== null;
        return (
            <Modal isOpen={isOpen} style={themeModalStyle}>
                <CloseModalButton onClick={reset} />
                <ModalContent>
                    {currentStep && currentStep.kind === StepKind.UnlockToken && <UnlockTokensStepContainer />}
                    {currentStep && currentStep.kind === StepKind.BuySellLimit && <SignOrderStepContainer />}
                    {currentStep && currentStep.kind === StepKind.BuySellMarket && <BuySellTokenStepContainer />}
                    {currentStep && currentStep.kind === StepKind.WrapEth && <WrapEthStepContainer />}
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
