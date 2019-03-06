import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { resetSteps, setStepsModalVisibility } from '../../../store/actions';
import { getIsStepsModalVisible, getStepsModalCurrentStep } from '../../../store/selectors';
import { Step, StepKind, StoreState } from '../../../util/types';

import { SignOrderStepContainer } from './sign_order_step';

interface StateProps {
    isStepsModalVisible: boolean;
    currentStep: Step | null;
}

interface DispatchProps {
    setModalVisibility: (flag: boolean) => any;
    reset: () => void;
}

type Props = StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { isStepsModalVisible, currentStep, setModalVisibility, reset } = this.props;

        const close = () => {
            setModalVisibility(false);
            reset();
        };

        return (
            <Modal isOpen={isStepsModalVisible}>
                <button type="button" onClick={close}>
                    x
                </button>
                {currentStep && currentStep.kind === StepKind.BuySellLimit && <SignOrderStepContainer />}
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
        setModalVisibility: setStepsModalVisibility,
        reset: resetSteps,
    },
)(StepsModal);

export { StepsModal, StepsModalContainer };
