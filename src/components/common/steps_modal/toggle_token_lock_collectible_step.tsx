import React from 'react';
import { connect } from 'react-redux';

import { lockToken, unlockToken } from '../../../store/blockchain/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { StepToggleCollectibleLock, StoreState, Token } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepToggleCollectibleLock;
}

interface DispatchProps {
    onLockToken: (token: Token) => Promise<any>;
    onUnlockToken: (token: Token) => Promise<any>;
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class ToggleCollectibleLockStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { isUnlocked, collectible } = step;
        const tokenSymbol = collectible.name;
        // const context = 'order';

        // const title = context === 'order' ? 'Order setup' : isUnlocked ? 'Lock Collectible' : 'Unlock Collectible';
        const title = 'Order setup';
        const confirmCaption = `Confirm on Metamask to ${
            isUnlocked ? 'lock' : 'unlock'
        } ${tokenSymbol} for trading on 0x.`;
        const loadingCaption = isUnlocked
            ? `Locking ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
            : `Unlocking ${tokenSymbol}. It will remain unlocked for future trades`;
        const doneCaption = isUnlocked
            ? `Locked ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
            : `Unlocked ${tokenSymbol}. It will remain unlocked for future trades`;
        const errorCaption = `${isUnlocked ? 'Locking' : 'Unlocking'} ${tokenSymbol} failed.`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = !isUnlocked ? ` ${tokenSymbol} Unlocked!` : ` ${tokenSymbol} Locked!`;

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
                runAction={this._toggleToken}
                showPartialProgress={true}
            />
        );
    };

    private readonly _toggleToken = async ({ onLoading, onDone, onError }: any) => {
        /*
                const { step, onLockToken, onUnlockToken } = this.props;
        const toggleToken = step.isUnlocked ? onLockToken : onUnlockToken;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash = await toggleToken(step.token);
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            onDone();
            await sleep(DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            onError(err);
        }

         */
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
            onLockToken: (token: Token) => dispatch(lockToken(token)),
            onUnlockToken: (token: Token) => dispatch(unlockToken(token)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(ToggleCollectibleLockStep);

export { ToggleCollectibleLockStep, ToggleCollectibleLockStepContainer };
