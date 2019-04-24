import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { stepsModalReset } from '../../../store/actions';
import {
    getStepsModalCurrentStep,
    getStepsModalDoneSteps,
    getStepsModalPendingSteps,
    getThemeModalsColors,
} from '../../../store/selectors';
import { BasicThemeModal } from '../../../themes/modal/BasicThemeModal';
import { getStepTitle, isLongStep } from '../../../util/steps';
import { Step, StepKind, StoreState } from '../../../util/types';
import { CloseModalButton } from '../icons/close_modal_button';

import { BuySellTokenStepContainer } from './buy_sell_token_step';
import { SignOrderStepContainer } from './sign_order_step';
import { ModalContent } from './steps_common';
import { StepItem } from './steps_progress';
import { ToggleTokenLockStepContainer } from './toggle_token_lock_step';
import { WrapEthStepContainer } from './wrap_eth_step';

interface StateProps {
    currentStep: Step | null;
    doneSteps: Step[];
    pendingSteps: Step[];
    themeModalColorsConfig: BasicThemeModal;
}

interface DispatchProps {
    reset: () => void;
}

type Props = StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { currentStep, doneSteps, pendingSteps, reset, themeModalColorsConfig } = this.props;
        const isOpen = currentStep !== null;

        const buildStepsProgress = (currentStepItem: StepItem): StepItem[] => [
            ...doneSteps.map(doneStep => ({
                title: getStepTitle(doneStep),
                progress: 100,
                active: false,
                isLong: isLongStep(doneStep),
            })),
            currentStepItem,
            ...pendingSteps.map(pendingStep => ({
                title: getStepTitle(pendingStep),
                progress: 0,
                active: false,
                isLong: isLongStep(pendingStep),
            })),
        ];

        // this is used to avoid an issue with two consecutive steps of the same kind
        const stepIndex = doneSteps.length;

        return (
            <Modal isOpen={isOpen} style={themeModalColorsConfig}>
                <CloseModalButton onClick={reset} />
                <ModalContent>
                    {currentStep && currentStep.kind === StepKind.ToggleTokenLock && (
                        <ToggleTokenLockStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.BuySellLimit && (
                        <SignOrderStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.BuySellMarket && (
                        <BuySellTokenStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.WrapEth && (
                        <WrapEthStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                </ModalContent>
            </Modal>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        currentStep: getStepsModalCurrentStep(state),
        doneSteps: getStepsModalDoneSteps(state),
        pendingSteps: getStepsModalPendingSteps(state),
        themeModalColorsConfig: getThemeModalsColors(state),
    };
};

const StepsModalContainer = connect(
    mapStateToProps,
    {
        reset: stepsModalReset,
    },
)(StepsModal);

export { StepsModal, StepsModalContainer };
