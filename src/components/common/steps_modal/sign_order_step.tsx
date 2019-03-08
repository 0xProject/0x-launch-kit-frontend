import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

interface StateProps {
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<SignedOrder>;
    submitLimitOrder: (singedOrder: SignedOrder) => Promise<any>;
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

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

class SignOrderStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.Initial,
    };

    public componentDidMount = async () => {
        await this._getSignedOrder();
    };

    public render = () => {
        const { status } = this.state;
        let content;
        switch (status) {
            case StepStatus.Loading:
                // @TODO: add spinner
                content = <p>Submitting order.</p>;
                break;
            case StepStatus.Done:
                // @TODO: add green-done image
                content = (
                    <p>
                        Order successfully placed!
                        <br />
                        (may not be filled immediately)
                    </p>
                );
                break;
            default:
                // @TODO: add Metamas image
                content = <p>Confirm signature on Metamask to submit order.</p>;
                break;
        }
        return (
            <>
                <Title>Order Setup</Title>
                {content}
            </>
        );
    };

    private readonly _getSignedOrder = async () => {
        const { amount, price, side } = this.props.step;
        const signedOrder = await this.props.createSignedOrder(amount, price, side);
        this.setState({ status: StepStatus.Loading });
        await this.props.submitLimitOrder(signedOrder);
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
            submitLimitOrder: (signedOrder: SignedOrder) => dispatch(submitLimitOrder(signedOrder)),
            createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
                dispatch(createSignedOrder(amount, price, side)),
        };
    },
)(SignOrderStep);

export { SignOrderStep, SignOrderStepContainer };
