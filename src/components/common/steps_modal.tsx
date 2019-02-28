import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { resetSteps, setStepsModalVisibility, stepsModalAdvanceStep } from '../../store/actions';
import { getIsStepsModalVisible, getStepsModalCurrentStep } from '../../store/selectors';
import { Step, StepKind, StoreState } from '../../util/types';

import { LoadingStepContainer } from './loading_step';
import { SignOrderStepContainer } from './sign_order_step';
import { SuccessStepContainer } from './success_step';

interface StateProps {
    isStepsModalVisible: boolean;
    currentStep: Step | null;
}

interface DispatchProps {
    setModalVisibility: (flag: boolean) => any;
    advanceStep: () => any;
    reset: () => void;
}

type Props = StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { isStepsModalVisible, currentStep, advanceStep, setModalVisibility, reset } = this.props;

        const close = () => {
            setModalVisibility(false);
            reset();
        };

        let modalContent = null;
        if (currentStep && currentStep.kind === StepKind.BuySellLimit) {
            modalContent = <SignOrderStepContainer onSuccess={advanceStep} />;
        } else if (currentStep && currentStep.kind === StepKind.Loading) {
            modalContent = <LoadingStepContainer onSuccess={advanceStep} />;
        } else if (currentStep && currentStep.kind === StepKind.Success) {
            modalContent = <SuccessStepContainer onSuccess={advanceStep} />;
        } else if (currentStep === null) {
            modalContent = <p>Done!</p>;
        }

        return (
            <Modal isOpen={isStepsModalVisible}>
                <button type="button" onClick={close}>
                    x
                </button>
                {modalContent}
            </Modal>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        isStepsModalVisible: getIsStepsModalVisible(state),
        currentStep: getStepsModalCurrentStep(state),
    };
};

const StepsModalContainer = connect(
    mapStateToProps,
    {
        advanceStep: stepsModalAdvanceStep,
        setModalVisibility: setStepsModalVisibility,
        reset: resetSteps,
    },
)(StepsModal);

export { StepsModal, StepsModalContainer };
