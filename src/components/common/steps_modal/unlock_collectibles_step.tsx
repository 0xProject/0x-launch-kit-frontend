import React from 'react';
import { connect } from 'react-redux';

import { STEP_MODAL_DONE_STATUS_VISIBILITY_TIME } from '../../../common/constants';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { unlockCollectible } from '../../../store/blockchain/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { sleep } from '../../../util/sleep';
import { Collectible, StepUnlockCollectibles, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepUnlockCollectibles;
}

interface DispatchProps {
    advanceStep: () => void;
    onUnlockCollectible: (collectible: Collectible) => Promise<string>;
}

type Props = OwnProps & StateProps & DispatchProps;

class UnlockCollectiblesStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { isUnlocked, collectible } = step;
        const collectibleName = collectible.name;
        const title = `Selling ${collectibleName}`;
        const confirmCaption = `Confirm on Metamask to ${
            isUnlocked ? 'lock' : 'unlock'
        } ${collectibleName} for trading on 0x.`;
        const loadingCaption = isUnlocked
            ? `Locking ${collectibleName}. You won't be able to use it for trading until you unlock it again`
            : `Unlocking ${collectibleName}. It will remain unlocked for future trades`;
        const doneCaption = isUnlocked
            ? `Locked ${collectibleName}. You won't be able to use it for trading until you unlock it again`
            : `Unlocked ${collectibleName}. It will remain unlocked for future trades`;
        const errorCaption = `${isUnlocked ? 'Locking' : 'Unlocking'} ${collectibleName} failed.`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = !isUnlocked ? ` ${collectibleName} Unlocked!` : ` ${collectibleName} Locked!`;

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
                runAction={this._unlockCollectibles}
                showPartialProgress={true}
            />
        );
    };

    private readonly _unlockCollectibles = async ({ onLoading, onDone, onError }: any) => {
        const { advanceStep, onUnlockCollectible, step } = this.props;

        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash = await onUnlockCollectible(step.collectible);
            onLoading();
            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            onDone();
            await sleep(STEP_MODAL_DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (error) {
            onError(error);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepUnlockCollectibles,
    };
};

const UnlockCollectiblesStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
            onUnlockCollectible: (collectible: Collectible) => dispatch(unlockCollectible(collectible)),
        };
    },
)(UnlockCollectiblesStep);

export { UnlockCollectiblesStep, UnlockCollectiblesStepContainer };
