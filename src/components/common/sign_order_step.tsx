import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { submitOrder } from '../../store/actions';
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
}

type Props = OwnProps & StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { step, onSubmitOrder, onSuccess } = this.props;
        await onSubmitOrder(step.amount, step.price, step.side);
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
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
