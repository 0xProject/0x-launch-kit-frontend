import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';

import { setTransactionStepsModalVisibility, transactionStepsModalAdvanceStep } from '../../store/actions';
import { getIsTransactionStepsModalVisible, getTransactionStepsModalCurrentStep } from '../../store/selectors';
import { StoreState, TransactionStep, TransactionStepKind } from '../../util/types';

import { SignOrderStepContainer } from './sign_order_step';

interface StateProps {
    isTransactionStepsModalVisible: boolean;
    currentStep: TransactionStep | null;
}

interface DispatchProps {
    setModalVisibility: (flag: boolean) => any;
    advanceStep: () => any;
}

type Props = StateProps & DispatchProps;

class TransactionStepsModal extends React.Component<Props> {
    public render = () => {
        const { isTransactionStepsModalVisible, currentStep, advanceStep, setModalVisibility } = this.props;

        const close = () => setModalVisibility(false);

        let modalContent = null;
        if (currentStep !== null && currentStep.kind === TransactionStepKind.BuySellLimit) {
            modalContent = <SignOrderStepContainer onSuccess={advanceStep} />;
        } else if (currentStep === null) {
            modalContent = <p>Done!</p>;
        }

        return (
            <Modal isOpen={isTransactionStepsModalVisible}>
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
        isTransactionStepsModalVisible: getIsTransactionStepsModalVisible(state),
        currentStep: getTransactionStepsModalCurrentStep(state),
    };
};

const TransactionStepsModalContainer = connect(
    mapStateToProps,
    {
        advanceStep: transactionStepsModalAdvanceStep,
        setModalVisibility: setTransactionStepsModalVisibility,
    },
)(TransactionStepsModal);

export { TransactionStepsModal, TransactionStepsModalContainer };
