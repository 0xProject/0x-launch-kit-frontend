import React from 'react';
import { connect } from 'react-redux';

import { getRelayer } from '../../../services/relayer';
import { advanceStepAndScheduleStepLoadingUpdate } from '../../../store/actions';
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
}

type Props = StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { step, advanceStep, ethAccount, selectedToken } = this.props;
        const { amount, price, side } = step;
        const signedOrder = await createSignedOrder(amount, price, side, ethAccount, selectedToken);
        advanceStep(getRelayer().client.submitOrderAsync(signedOrder));
    };

    public render = () => {
        return <p>Confirm on metamask</p>;
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
        advanceStep: advanceStepAndScheduleStepLoadingUpdate,
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
