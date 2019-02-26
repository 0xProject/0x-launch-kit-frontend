import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { submitOrder } from '../../store/actions';
import { getTransactionStepsModalCurrentStep } from '../../store/selectors';
import { OrderSide, StoreState, TransactionStepBuySellLimitOrder } from '../../util/types';

interface OwnProps {
    onSuccess: () => any;
}

interface StateProps {
    step: TransactionStepBuySellLimitOrder;
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
        step: getTransactionStepsModalCurrentStep(state) as TransactionStepBuySellLimitOrder,
    };
};

const SignOrderStepContainer = connect(
    mapStateToProps,
    {
        onSubmitOrder: submitOrder,
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
