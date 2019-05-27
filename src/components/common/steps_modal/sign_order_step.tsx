import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { SignatureFailedException } from './exceptions/signature_failed_exception';
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
        const { amount, price, side } = this.props.step;
        try {
            const signedOrder = await this.props.createSignedOrder(amount, price, side);
            onLoading();
            await this.props.submitLimitOrder(signedOrder, amount, side);
            onDone();
        } catch (error) {
            const signError = new SignatureFailedException(error);
            this.setState(
                {
                    errorMsg: signError.message,
                },
                () => onError(signError),
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
