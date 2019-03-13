import { BigNumber } from '0x.js';
import { SignedOrder } from '@0x/connect';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

import {
    ModalText,
    ModalTextClickable,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';

interface StateProps {
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<SignedOrder>;
    submitLimitOrder: (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => Promise<any>;
}

type Props = StateProps & DispatchProps;

interface State {
    status: StepStatus;
}

class SignOrderStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
    };

    public componentDidMount = async () => {
        await this._getSignedOrder();
    };

    public render = () => {
        const { status } = this.state;
        const retry = () => this._retry();
        let content;

        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>Submitting order.</ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>Order successfully placed! (may not be filled immediately)</ModalText>
                    </StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            Error signing/submitting order.{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>Confirm signature on Metamask to submit order.</ModalText>
                    </StepStatusConfirmOnMetamask>
                );
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
        await this.props.submitLimitOrder(signedOrder, amount, side);
        this.setState({ status: StepStatus.Done });
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.Error });
        await this._getSignedOrder();
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
