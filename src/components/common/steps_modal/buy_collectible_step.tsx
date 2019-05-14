import { BigNumber, SignedOrder } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { submitBuyCollectible } from '../../../store/actions';
import { getEstimatedTxTimeMs, getEthAccount, getStepsModalCurrentStep } from '../../../store/selectors';
import { StepBuyCollectible, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    ethAccount: string;
    step: StepBuyCollectible;
}

interface DispatchProps {
    submitBuyCollectible: (order: SignedOrder, ethAccount: string) => Promise<any>;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class BuyCollectibleStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;

        const title = 'Buy collectible';

        const confirmCaption = 'Confirm on Metamask.';
        const loadingCaption = 'Processing buy.';
        const doneCaption = 'Buy Complete!';
        const errorCaption = `buying.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `Collectible received`;

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
                runAction={this._confirmOnMetamaskBuy}
                showPartialProgress={true}
            />
        );
    };

    private readonly _confirmOnMetamaskBuy = async ({ onLoading, onDone, onError }: any) => {
        const { ethAccount, step } = this.props;
        const { order } = step;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash = await this.props.submitBuyCollectible(order, ethAccount);
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(txHash);

            onDone();
        } catch (err) {
            onError(err);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        ethAccount: getEthAccount(state),
        step: getStepsModalCurrentStep(state) as StepBuyCollectible,
    };
};

const BuyCollectibleStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            submitBuyCollectible: (order: SignedOrder, ethAccount: string) =>
                dispatch(submitBuyCollectible(order, ethAccount)),
        };
    },
)(BuyCollectibleStep);

export { BuyCollectibleStep, BuyCollectibleStepContainer };
