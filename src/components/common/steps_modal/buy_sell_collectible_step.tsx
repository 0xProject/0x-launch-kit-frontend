import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { STEP_MODAL_DONE_STATUS_VISIBILITY_TIME } from '../../../common/constants';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import {
    createSignedCollectibleOrder,
    goToIndividualCollectible,
    submitBuyCollectible,
    submitCollectibleOrder,
} from '../../../store/actions';
import { getEstimatedTxTimeMs, getEthAccount, getStepsModalCurrentStep } from '../../../store/selectors';
import { sleep } from '../../../util/sleep';
import {
    Collectible,
    OrderSide,
    StepBuyCollectible,
    StepKind,
    StepSellCollectible,
    StoreState,
} from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
    closeModal: () => void;
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepSellCollectible | StepBuyCollectible;
    ethAccount: string;
}

interface DispatchProps {
    createSignedCollectibleOrder: (
        collectible: Collectible,
        side: OrderSide,
        startPrice: BigNumber,
        expirationDate: BigNumber,
        endPrice: BigNumber | null,
    ) => Promise<any>;
    submitCollectibleOrder: (signedOrder: SignedOrder) => Promise<any>;
    submitBuyCollectible: (order: SignedOrder, ethAccount: string) => Promise<any>;
    goToIndividualCollectible: (collectibleId: string) => Promise<any>;
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
        const collectibleName = collectible.name;

        const isBuy = step.kind === StepKind.BuyCollectible;

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
                runAction={isBuy ? this._confirmOnMetamaskBuy : this._confirmOnMetamaskSell}
                showPartialProgress={true}
            />
        );
    };

    private readonly _confirmOnMetamaskSell = async ({ onLoading, onDone, onError }: any) => {
        const { step } = this.props;
        if (step.kind === StepKind.SellCollectible) {
            const stepSell: StepSellCollectible = step;
            const { startPrice, endPrice, expirationDate, side, collectible } = stepSell;
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

                await sleep(STEP_MODAL_DONE_STATUS_VISIBILITY_TIME);

                // Go to the collectible's profile
                await this.props.goToIndividualCollectible(collectible.tokenId);
                this.props.closeModal();
            } catch (error) {
                onError(error);
            }
        }
    };

    private readonly _confirmOnMetamaskBuy = async ({ onLoading, onDone, onError }: any) => {
        const { ethAccount, step } = this.props;
        if (step.kind === StepKind.BuyCollectible) {
            const stepBuy: StepBuyCollectible = step;
            const { order } = stepBuy;
            try {
                const web3Wrapper = await getWeb3Wrapper();
                const txHash = await this.props.submitBuyCollectible(order, ethAccount);
                onLoading();

                await web3Wrapper.awaitTransactionSuccessAsync(txHash);

                onDone();
            } catch (err) {
                onError(err);
            }
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        ethAccount: getEthAccount(state),
        step: getStepsModalCurrentStep(state) as StepSellCollectible | StepBuyCollectible,
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
        submitBuyCollectible: (order: SignedOrder, ethAccount: string) =>
            dispatch(submitBuyCollectible(order, ethAccount)),
        goToIndividualCollectible: (collectibleId: string) => dispatch(goToIndividualCollectible(collectibleId)),
    };
};

const BuySellCollectibleStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(BuySellCollectibleStep);

export { BuySellCollectibleStep, BuySellCollectibleStepContainer };
