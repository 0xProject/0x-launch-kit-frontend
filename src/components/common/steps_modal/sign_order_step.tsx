import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { OrderSide, StepBuySellLimitOrder, StoreState } from '../../../util/types';

import { BaseStepModalContainer } from './base_step_modal';
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

type Props = OwnProps & StateProps & DispatchProps;

class SignOrderStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;

        const isBuy = step.side === OrderSide.Buy;

        const title = 'Order setup';
        const confirmCaption = 'Confirm signature on Metamask to submit order to the book.';
        const loadingCaption = 'Submitting order.';
        const doneCaption = `${isBuy ? 'Buy' : 'Sell'} order for ${tokenSymbolToDisplayString(
            step.token.symbol,
        )} placed! (may not be filled immediately)`;
        const errorCaption = 'Error signing/submitting order.';
        const loadingFooterCaption = `Waiting for signature...`;
        const doneFooterCaption = `Order placed!`;

        return (
            <BaseStepModalContainer
                step={step}
                title={title}
                confirmCaption={confirmCaption}
                loadingCaption={loadingCaption}
                doneCaption={doneCaption}
                errorCaption={errorCaption}
                loadingFooterCaption={loadingFooterCaption}
                doneFooterCaption={doneFooterCaption}
                buildStepsProgress={buildStepsProgress}
                estimatedTxTimeMs={estimatedTxTimeMs}
                runAction={this._getSignedOrder}
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
        } catch (err) {
            onError(err);
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
