import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

interface StateProps {
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<SignedOrder>;
    submitLimitOrder: (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => Promise<any>;
}

type Props = StateProps & DispatchProps;

enum StepStatus {
    Initial,
    Loading,
    Done,
}

interface State {
    status: StepStatus;
}

class SignOrderStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.Initial,
    };

    public componentDidMount = async () => {
        await this._getSignedOrder();
    };

    public render = () => {
        const { status } = this.state;
        switch (status) {
            case StepStatus.Loading:
                return <p>Loading...</p>;
            case StepStatus.Done:
                return <p>Success!</p>;
            default:
                return <p>Please confirm on MM.</p>;
        }
    };

    private readonly _getSignedOrder = async () => {
        const { amount, price, side } = this.props.step;
        const signedOrder = await this.props.createSignedOrder(amount, price, side);
        this.setState({ status: StepStatus.Loading });
        await this.props.submitLimitOrder(signedOrder, amount, side);
        this.setState({ status: StepStatus.Done });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepBuySellLimitOrder,
    };
};

const SignOrderStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            submitLimitOrder: (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) =>
                dispatch(submitLimitOrder(signedOrder, amount, side)),
            createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
                dispatch(createSignedOrder(amount, price, side)),
        };
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
