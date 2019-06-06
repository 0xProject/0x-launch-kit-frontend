import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { INSUFFICIENT_FEE_BALANCE, INSUFFICIENT_MAKER_BALANCE_ERR, SIGNATURE_ERR } from '../../../exceptions/common';
import { InsufficientFeeBalanceException } from '../../../exceptions/insufficient_fee_balance_exception';
import { InsufficientTokenBalanceException } from '../../../exceptions/insufficient_token_balance_exception';
import { SignatureFailedException } from '../../../exceptions/signature_failed_exception';
import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepBuySellLimitOrder;
}

interface DispatchProps {
    createSignedOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) => Promise<SignedOrder>;
    submitLimitOrder: (signedOrder: SignedOrder, amount: BigNumber, side: OrderSide) => Promise<any>;
}

interface State {
    errorMsg: string;
}

type Props = OwnProps & StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props, State> {
    public state = {
        errorMsg: 'Error signing/submitting order.',
    };
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;

        const isBuy = step.side === OrderSide.Buy;

        const title = 'Order setup';
        const confirmCaption = 'Confirm signature on Metamask to submit order to the book.';
        const loadingCaption = 'Submitting order.';
        const doneCaption = `${isBuy ? 'Buy' : 'Sell'} order for ${tokenSymbolToDisplayString(
            step.token.symbol,
        )} placed! (may not be filled immediately)`;
        const errorCaption = this.state.errorMsg;
        const loadingFooterCaption = `Waiting for signature...`;
        const doneFooterCaption = `Order placed!`;

        return (
            <BaseStepModal
                buildStepsProgress={buildStepsProgress}
                confirmCaption={confirmCaption}
                doneCaption={doneCaption}
                doneFooterCaption={doneFooterCaption}
                errorCaption={errorCaption}
                estimatedTxTimeMs={estimatedTxTimeMs}
                loadingCaption={loadingCaption}
                loadingFooterCaption={loadingFooterCaption}
                runAction={this._getSignedOrder}
                step={step}
                title={title}
            />
        );
    };

    private readonly _getSignedOrder = async ({ onLoading, onDone, onError }: any) => {
        const { step } = this.props;
        const { amount, price, side } = step;
        try {
            const signedOrder = await this.props.createSignedOrder(amount, price, side);
            onLoading();
            await this.props.submitLimitOrder(signedOrder, amount, side);
            onDone();
        } catch (error) {
            let errorException = error;
            if (error.message.toLowerCase() === INSUFFICIENT_MAKER_BALANCE_ERR.toLowerCase()) {
                // Maker balance not enough
                errorException = new InsufficientTokenBalanceException(step.token.symbol);
            } else if (error.message.toString().includes(INSUFFICIENT_FEE_BALANCE)) {
                // Fee balance not enough
                errorException = new InsufficientFeeBalanceException();
            } else if (error.message.toString().includes(SIGNATURE_ERR)) {
                // User denied signature
                errorException = new SignatureFailedException(error);
            }

            const errorMsg = errorException.message;
            this.setState(
                {
                    errorMsg,
                },
                () => onError(errorException),
            );
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
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
