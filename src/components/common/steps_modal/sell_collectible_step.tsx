import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { createSignedCollectibleOrder, submitCollectibleOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { Collectible, OrderSide, StepSellCollectible, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepSellCollectible;
}

interface DispatchProps {
    // refreshOrders: () => any; // TODO: once the integration with openSea is done, this should be uncommented
    // TODO: later this should contain something like 'notifySellCollectible'
    createSignedCollectibleOrder: (
        collectible: Collectible,
        side: OrderSide,
        startPrice: BigNumber,
        expirationDate: BigNumber,
        endPrice: BigNumber | null,
    ) => Promise<any>;
    submitCollectibleOrder: (signedOrder: SignedOrder) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class SellCollectibleStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { collectible } = step;
        const collectibleName = collectible.name;

        const isBuy = step.side === OrderSide.Buy;

        const title = `${isBuy ? 'Buying' : 'Selling'} ${collectibleName}`;

        const confirmCaption = `Confirm on Metamask to submit ${isBuy ? 'purchase' : 'sell'} for ${collectibleName}.`;
        const loadingCaption = `Processing ${isBuy ? 'purchase' : 'sale'} of ${collectibleName}.`;
        const doneCaption = isBuy
            ? `Purchase of ${collectibleName} Successful!`
            : `Order placed. ${collectibleName} is now listed on sale`;
        const errorCaption = `${isBuy ? 'Buying' : 'Selling'} ${collectibleName}.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = isBuy ? `${collectibleName} received` : `Order for ${collectibleName} placed!`;

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
        const { startPrice, endPrice, expirationDate, side, collectible } = this.props.step;
        try {
            const signedOrder = await this.props.createSignedCollectibleOrder(
                collectible,
                side,
                startPrice,
                expirationDate,
                endPrice,
            );
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
        step: getStepsModalCurrentStep(state) as StepSellCollectible,
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        submitCollectibleOrder: (signedOrder: SignedOrder) => dispatch(submitCollectibleOrder(signedOrder)),
        createSignedCollectibleOrder: (
            collectible: Collectible,
            side: OrderSide,
            startPrice: BigNumber,
            expirationDate: BigNumber,
            endPrice: BigNumber | null,
        ) => dispatch(createSignedCollectibleOrder(collectible, side, startPrice, expirationDate, endPrice)),
        // refreshOrders: () => dispatch(getUserCollectibles()),
    };
};

const SellCollectibleStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SellCollectibleStep);

export { SellCollectibleStep, SellCollectibleStepContainer };
