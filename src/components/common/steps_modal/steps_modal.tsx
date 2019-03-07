import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { stepsModalReset } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { Step, StepKind, StoreState } from '../../../util/types';

import { SignOrderStepContainer } from './sign_order_step';

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
            <Modal isOpen={isOpen}>
                <button type="button" onClick={reset}>
                    x
                </button>
                {currentStep && currentStep.kind === StepKind.BuySellLimit && <SignOrderStepContainer />}
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
