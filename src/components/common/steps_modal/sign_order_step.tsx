import React from 'react';
import { connect } from 'react-redux';

import { getRelayer } from '../../../services/relayer';
import { getAllOrders, getUserOrders, stepsModalAdvanceStep } from '../../../store/actions';
import { getEthAccount, getSelectedToken, getStepsModalCurrentStep } from '../../../store/selectors';
import { createSignedOrder } from '../../../util/signed_order';
import { StepBuySellLimitOrder, StoreState, Token } from '../../../util/types';

interface StateProps {
    step: StepBuySellLimitOrder;
    ethAccount: string;
    selectedToken: Token;
}

interface DispatchProps {
    advanceStep: (promise: Promise<any>) => any;
    getAllOrders: () => any;
    getUserOrders: () => any;
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

    public componentWillUnmount = () => {
        this.props.getAllOrders();
        this.props.getUserOrders();
    };

    private readonly _getSignedOrder = async () => {
        const { ethAccount, selectedToken, step } = this.props;
        const { amount, price, side } = step;
        const signedOrder = await createSignedOrder(amount, price, side, ethAccount, selectedToken);
        this.setState({ status: StepStatus.Loading });
        await getRelayer().client.submitOrderAsync(signedOrder);
        this.setState({ status: StepStatus.Done });
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepBuySellLimitOrder,
        ethAccount: getEthAccount(state),
        selectedToken: getSelectedToken(state) as Token,
    };
};

const SignOrderStepContainer = connect(
    mapStateToProps,
    {
        advanceStep: stepsModalAdvanceStep,
        getAllOrders,
        getUserOrders,
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
