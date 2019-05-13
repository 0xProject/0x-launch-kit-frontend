import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { submitMarketOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellCollectible, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepBuySellCollectible;
}

interface DispatchProps {
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<{ txHash: string; amountInReturn: BigNumber }>;
    // refreshOrders: () => any; // TODO: once the integration with openSea is done, this should be uncommented
    // TODO: later this should contain something like 'notifyBuySellCollectible'
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class BuySellCollectibleStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { collectible } = step;
        const collectibleSymbol = collectible.name;

        const isBuy = step.side === OrderSide.Buy;

        const title = `${isBuy ? 'Buying' : 'Selling'} ${collectibleSymbol}`;

        const confirmCaption = `Confirm on Metamask to submit ${isBuy ? 'purchase' : 'sell'} for ${collectibleSymbol}.`;
        const loadingCaption = `Processing ${isBuy ? 'purchase' : 'sale'} of ${collectibleSymbol}.`;
        const doneCaption = isBuy
            ? `Purchase of ${collectibleSymbol} Successful!`
            : `Order placed. ${collectibleSymbol} is now listed on sale`;
        const errorCaption = `${isBuy ? 'Buying' : 'Selling'} ${collectibleSymbol}.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = isBuy ? `${collectibleSymbol} received` : `Order for ${collectibleSymbol} placed!`;

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
                runAction={this._confirmOnMetamaskBuyOrSell}
                showPartialProgress={true}
            />
        );
    };

    private readonly _confirmOnMetamaskBuyOrSell = async ({ onLoading, onDone, onError }: any) => {
        // TODO Implement
        onLoading();
        setTimeout(() => {
            onDone();
        }, 5000);
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepBuySellCollectible,
    };
};

const BuySellCollectibleStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => dispatch(submitMarketOrder(amount, side)),
            // refreshOrders: () => dispatch(getUserCollectibles()),
        };
    },
)(BuySellCollectibleStep);

export { BuySellCollectibleStep, BuySellCollectibleStepContainer };
