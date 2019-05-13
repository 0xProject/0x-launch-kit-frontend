import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedCollectibleOrder, submitCollectibleOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { Collectible, OrderSide, StepBuySellCollectible, StoreState } from '../../../util/types';

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
    // refreshOrders: () => any; // TODO: once the integration with openSea is done, this should be uncommented
    // TODO: later this should contain something like 'notifyBuySellCollectible'
    createSignedCollectibleOrder: (collectible: Collectible, price: BigNumber, side: OrderSide) => Promise<any>;
    submitCollectibleOrder: (signedOrder: SignedOrder) => Promise<any>;
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
        const { startPrice, side, collectible } = this.props.step;
        try {
            const signedOrder = await this.props.createSignedCollectibleOrder(collectible, startPrice, side);
            onLoading();
            await this.props.submitCollectibleOrder(signedOrder);
            onDone();
        } catch (error) {
            onError(error);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepBuySellCollectible,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        submitCollectibleOrder: (signedOrder: SignedOrder) => dispatch(submitCollectibleOrder(signedOrder)),
        createSignedCollectibleOrder: (collectible: Collectible, price: BigNumber, side: OrderSide) =>
            dispatch(createSignedCollectibleOrder(collectible, price, side)),
        // refreshOrders: () => dispatch(getUserCollectibles()),
    };
};

const BuySellCollectibleStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuySellCollectibleStep);

export { BuySellCollectibleStep, BuySellCollectibleStepContainer };
