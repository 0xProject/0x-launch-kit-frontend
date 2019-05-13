import React from 'react';
import { connect } from 'react-redux';

import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { sleep } from '../../../util/sleep';
import { StepToggleCollectibleLock, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { DONE_STATUS_VISIBILITY_TIME } from './steps_common';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepToggleCollectibleLock;
}

interface DispatchProps {
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class ToggleCollectibleLockStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { isUnlocked, collectible } = step;
        const collectibleSymbol = collectible.name;
        const title = `Selling ${collectibleSymbol}`;
        const confirmCaption = `Confirm on Metamask to ${
            isUnlocked ? 'lock' : 'unlock'
        } ${collectibleSymbol} for trading on 0x.`;
        const loadingCaption = isUnlocked
            ? `Locking ${collectibleSymbol}. You won't be able to use it for trading until you unlock it again`
            : `Unlocking ${collectibleSymbol}. It will remain unlocked for future trades`;
        const doneCaption = isUnlocked
            ? `Locked ${collectibleSymbol}. You won't be able to use it for trading until you unlock it again`
            : `Unlocked ${collectibleSymbol}. It will remain unlocked for future trades`;
        const errorCaption = `${isUnlocked ? 'Locking' : 'Unlocking'} ${collectibleSymbol} failed.`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = !isUnlocked ? ` ${collectibleSymbol} Unlocked!` : ` ${collectibleSymbol} Locked!`;

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
                runAction={this._toggleCollectible}
                showPartialProgress={true}
            />
        );
    };

    private readonly _toggleCollectible = async ({ onLoading, onDone, onError }: any) => {
        const { advanceStep } = this.props;
        // TODO Implement
        onLoading();
        setTimeout(async () => {
            onDone();
            await sleep(DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        }, 500);
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepToggleCollectibleLock,
    };
};

const ToggleCollectibleLockStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(ToggleCollectibleLockStep);

export { ToggleCollectibleLockStep, ToggleCollectibleLockStepContainer };
