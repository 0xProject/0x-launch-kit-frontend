import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { lockToken, unlockToken } from '../../../store/blockchain/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { getStepTitle, makeGetProgress } from '../../../util/steps';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { StepToggleTokenLock, StoreState, Token } from '../../../util/types';

import { StepPendingTime } from './step_pending_time';
import {
    DONE_STATUS_VISIBILITY_TIME,
    ModalText,
    ModalTextClickable,
    sleep,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';
import { GetProgress, StepItem, StepsProgress } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepToggleTokenLock;
}

interface DispatchProps {
    lockToken: (token: Token) => Promise<any>;
    unlockToken: (token: Token) => Promise<any>;
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    status: StepStatus;
    txStarted: number | null;
}

const initialState: State = {
    status: StepStatus.ConfirmOnMetamask,
    txStarted: null,
};

class ToggleTokenLockStep extends React.Component<Props, State> {
    public state = initialState;

    public componentDidMount = async () => {
        const { isUnlocked } = this.props.step;
        await this._toggleToken(isUnlocked);
    };

    public componentDidUpdate = async (prevProps: Props) => {
        // If there are consecutive StepToggleTokenLock in the flow, this will force the step "restart"
        if (this.props.step.token.address !== prevProps.step.token.address) {
            this.setState(initialState);
            await this._toggleToken(false);
        }
    };

    public render = () => {
        const { estimatedTxTimeMs, step } = this.props;
        const { context, token, isUnlocked } = step;
        const tokenSymbol = tokenSymbolToDisplayString(token.symbol);

        const { status, txStarted } = this.state;
        const retry = () => this._retry();
        let content;

        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>
                            {isUnlocked
                                ? `Locking ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                                : `Unlocking ${tokenSymbol}. It will remain unlocked for future trades`}
                        </ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>
                            {isUnlocked
                                ? `Locked ${tokenSymbol}. You won't be able to use it for trading until you unlock it again`
                                : `Unlocked ${tokenSymbol}. It will remain unlocked for future trades`}
                        </ModalText>
                    </StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            {isUnlocked ? 'Locking' : 'Unlocking'} {tokenSymbol} failed.{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>
                            Confirm on Metamask to {isUnlocked ? 'lock' : 'unlock'} {tokenSymbol}.
                        </ModalText>
                    </StepStatusConfirmOnMetamask>
                );
                break;
        }

        const title = context === 'order' ? 'Order setup' : isUnlocked ? 'Lock token' : 'Unlock token';

        let getProgress: GetProgress = () => 0;
        if (status === StepStatus.Loading && txStarted !== null) {
            getProgress = makeGetProgress(txStarted, estimatedTxTimeMs);
        } else if (status === StepStatus.Done) {
            getProgress = () => 100;
        }

        const stepsProgress = this.props.buildStepsProgress({
            title: getStepTitle(this.props.step),
            active: true,
            progress: getProgress,
        });

        return (
            <>
                <Title>{title}</Title>
                {content}
                <StepsProgress steps={stepsProgress} />
                <StepPendingTime txStarted={txStarted} stepStatus={status} estimatedTxTimeMs={estimatedTxTimeMs} />
            </>
        );
    };

    private readonly _toggleToken = async (isUnlocked: boolean) => {
        const { step, advanceStep } = this.props;
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const txHash = await (isUnlocked ? this.props.lockToken(step.token) : this.props.unlockToken(step.token));
            this.setState({ status: StepStatus.Loading, txStarted: Date.now() });

            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            this.setState({ status: StepStatus.Done });
            await sleep(DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
    };

    private readonly _retry = async () => {
        const { isUnlocked } = this.props.step;

        this.setState({ status: StepStatus.Error });

        await this._toggleToken(isUnlocked);
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepToggleTokenLock,
    };
};

const ToggleTokenLockStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            lockToken: (token: Token) => dispatch(lockToken(token)),
            unlockToken: (token: Token) => dispatch(unlockToken(token)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(ToggleTokenLockStep);

export { ToggleTokenLockStep, ToggleTokenLockStepContainer };
