import React from 'react';
import { connect } from 'react-redux';

import { STEP_MODAL_DONE_STATUS_VISIBILITY_TIME } from '../../../common/constants';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { lockToken, unlockToken } from '../../../store/blockchain/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep, getWallet } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { sleep } from '../../../util/sleep';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { StepToggleTokenLock, StoreState, Token, Wallet } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepToggleTokenLock;
    wallet: Wallet;
}

interface DispatchProps {
    onLockToken: (token: Token) => Promise<any>;
    onUnlockToken: (token: Token, address?: string, isProxy?: boolean) => Promise<any>;
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class ToggleTokenLockStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step, wallet } = this.props;
        const { context, isUnlocked, token } = step;
        const tokenSymbol = tokenSymbolToDisplayString(token.symbol);
        let title;
        let confirmCaption;
        let loadingCaption;
        let doneCaption;
        let errorCaption;
        let loadingFooterCaption;
        let doneFooterCaption;
        if (context === 'lending') {
            title = 'Lending Setup';
            confirmCaption = `Confirm on ${wallet} to ${isUnlocked ? 'lock' : 'unlock'} ${tokenSymbol} for lending.`;
            loadingCaption = isUnlocked
                ? `Locking ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                : `Unlocking ${tokenSymbol}. It will remain unlocked for future lendings`;
            doneCaption = isUnlocked
                ? `Locked ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                : `Unlocked ${tokenSymbol}. It will remain unlocked for future lendings`;
            errorCaption = `${isUnlocked ? 'Locking' : 'Unlocking'} ${tokenSymbol} failed.`;
            loadingFooterCaption = `Waiting for confirmation...`;
            doneFooterCaption = !isUnlocked ? ` ${tokenSymbol} Unlocked!` : ` ${tokenSymbol} Locked!`;
        } else {
            title = context === 'order' ? 'Order setup' : isUnlocked ? 'Lock token' : 'Unlock token';
            confirmCaption = `Confirm on ${wallet} to ${
                isUnlocked ? 'lock' : 'unlock'
            } ${tokenSymbol} for trading on 0x.`;
            loadingCaption = isUnlocked
                ? `Locking ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                : `Unlocking ${tokenSymbol}. It will remain unlocked for future trades`;
            doneCaption = isUnlocked
                ? `Locked ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                : `Unlocked ${tokenSymbol}. It will remain unlocked for future trades`;
            errorCaption = `${isUnlocked ? 'Locking' : 'Unlocking'} ${tokenSymbol} failed.`;
            loadingFooterCaption = `Waiting for confirmation...`;
            doneFooterCaption = !isUnlocked ? ` ${tokenSymbol} Unlocked!` : ` ${tokenSymbol} Locked!`;
        }

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
                wallet={wallet}
            />
        );
    };

    private readonly _toggleToken = async ({ onLoading, onDone, onError }: any) => {
        const { step, advanceStep, onLockToken, onUnlockToken } = this.props;

        const toggleToken = step.isUnlocked ? onLockToken : onUnlockToken;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash =
                step.context === 'lending'
                    ? await toggleToken(step.token, step.address, false)
                    : await toggleToken(step.token);
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            onDone();
            await sleep(STEP_MODAL_DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            onError(err);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepToggleTokenLock,
        wallet: getWallet(state) as Wallet,
    };
};

const ToggleTokenLockStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            onLockToken: (token: Token) => dispatch(lockToken(token)),
            onUnlockToken: (token: Token, address?: string, isProxy?: boolean) =>
                dispatch(unlockToken(token, address, isProxy)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(ToggleTokenLockStep);

export { ToggleTokenLockStep, ToggleTokenLockStepContainer };
