import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { setStepsModalTransactionPromise, submitOrder } from '../../store/actions';
import { getStepsModalCurrentStep } from '../../store/selectors';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../util/types';

interface OwnProps {
    onSuccess: () => any;
}

interface StateProps {
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    onSubmitOrder: (amount: BigNumber, price: number, side: OrderSide) => Promise<any>;
    setPromise: (promise: Promise<any>) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props> {
    public componentDidMount = () => {
        const { step, onSubmitOrder, onSuccess, setPromise } = this.props;
        setPromise(onSubmitOrder(step.amount, step.price, step.side));
        onSuccess();
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
        onSubmitOrder: submitOrder,
        setPromise: setStepsModalTransactionPromise,
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
