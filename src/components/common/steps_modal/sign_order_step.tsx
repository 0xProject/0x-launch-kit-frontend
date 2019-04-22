import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedOrder, submitLimitOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { extractJSONError } from '../../../util/error_messages';
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

        const title = 'Order setup';
        const confirmCaption = 'Confirm signature on Metamask to submit order.';
        const loadingCaption = 'Submitting order.';
        const doneCaption = 'Order successfully placed! (may not be filled immediately)';
        const errorCaption = this.state.errorMsg;
        const loadingFooterCaption = `Waiting for signature...`;
        const doneFooterCaption = `Order success!`;

        return (
            <BaseStepModal
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
            /* The error could be a metamask reject sign or an error from the relayer
               so we check first if the error comes from the relayer
            */
            if (err.message.includes('Bad Request')) {
                // The error object comes from the relayer as a string, we convert it to JSON before displaying it
                const errorObject = extractJSONError(err.message);
                if (errorObject) {
                    // Once it's converted, we extract the error msg to display
                    const errorMsg = errorObject.validationErrors[0].reason;
                    this.setState(
                        {
                            errorMsg,
                        },
                        onError(errorObject),
                    );
                }
            } else {
                onError(err);
            }
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
