import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { setStepsModalTransactionPromise, stepsModalAdvanceStep, submitLimitOrder } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

interface OwnProps {
    advanceStep: () => any;
}

interface StateProps {
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    advanceStep: () => any;
    onSubmitOrder: (amount: BigNumber, price: BigNumber, side: OrderSide, advanceStep: () => any) => any;
    setPromise: (promise: Promise<any>) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props> {
    public componentDidMount = () => {
        const { step, onSubmitOrder, advanceStep, setPromise } = this.props;
        setPromise(
            new Promise(resolve => {
                onSubmitOrder(step.amount, step.price, step.side, resolve);
                advanceStep();
            }),
        );
    };

    public render = () => {
        return <p>Confirm on metamask</p>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepBuySellLimitOrder,
    };
};

const SignOrderStepContainer = connect(
    mapStateToProps,
    {
        onSubmitOrder: submitLimitOrder,
        setPromise: setStepsModalTransactionPromise,
        advanceStep: stepsModalAdvanceStep,
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
