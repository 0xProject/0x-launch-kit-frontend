import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';

import { stepsModalReset } from '../../../store/actions';
import { getStepsModalCurrentStep, getStepsModalDoneSteps, getStepsModalPendingSteps } from '../../../store/selectors';
import { Theme } from '../../../themes/commons';
import { getStepTitle, isLongStep } from '../../../util/steps';
import { Step, StepKind, StoreState } from '../../../util/types';
import { CloseModalButton } from '../icons/close_modal_button';

import { BuySellCollectibleStepContainer } from './buy_sell_collectible_step';
import { BuySellTokenStepContainer } from './buy_sell_token_step';
import { SignOrderStepContainer } from './sign_order_step';
import { ModalContent } from './steps_common';
import { StepItem } from './steps_progress';
import { ToggleTokenLockStepContainer } from './toggle_token_lock_step';
import { UnlockCollectiblesStepContainer } from './unlock_collectibles_step';
import { WrapEthStepContainer } from './wrap_eth_step';

interface StateProps {
    currentStep: Step | null;
    doneSteps: Step[];
    pendingSteps: Step[];
}

interface OwnProps {
    theme: Theme;
}

interface DispatchProps {
    reset: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { currentStep, doneSteps, pendingSteps, reset, theme } = this.props;
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
            <Modal isOpen={isOpen} style={theme.modalTheme}>
                <CloseModalButton onClick={reset} />
                <ModalContent>
                    {currentStep && currentStep.kind === StepKind.ToggleTokenLock && (
                        <ToggleTokenLockStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.UnlockCollectibles && (
                        <UnlockCollectiblesStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.BuySellLimit && (
                        <SignOrderStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep && currentStep.kind === StepKind.BuySellMarket && (
                        <BuySellTokenStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}
                    {currentStep &&
                        (currentStep.kind === StepKind.SellCollectible ||
                            currentStep.kind === StepKind.BuyCollectible) && (
                            <BuySellCollectibleStepContainer
                                key={stepIndex}
                                buildStepsProgress={buildStepsProgress}
                                closeModal={reset}
                            />
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
    };
};

const StepsModalContainer = withTheme(
    connect(
        mapStateToProps,
        { reset: stepsModalReset },
    )(StepsModal),
);

export { StepsModal, StepsModalContainer };
