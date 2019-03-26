import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { lockToken, unlockToken } from '../../../store/blockchain/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { stepsModalAdvanceStep } from '../../../store/ui/actions';
import { tokenSymbolToDisplayString } from '../../../util/tokens';
import { StepToggleTokenLock, StoreState, Token } from '../../../util/types';

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

interface StateProps {
    step: StepToggleTokenLock;
}

interface DispatchProps {
    lockToken: (token: Token) => Promise<any>;
    unlockToken: (token: Token) => Promise<any>;
    advanceStep: () => void;
}

type Props = StateProps & DispatchProps;

interface State {
    status: StepStatus;
}

class ToggleTokenLockStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
    };

    public componentDidMount = async () => {
        const { isUnlocked } = this.props.step;
        if (isUnlocked) {
            await this._lockToken();
        } else {
            await this._unlockToken();
        }
    };

    public componentDidUpdate = async (prevProps: Props) => {
        // If there are consecutive StepToggleTokenLock in the flow, this will force the step "restart"
        if (this.props.step.token.address !== prevProps.step.token.address) {
            this.setState({ status: StepStatus.ConfirmOnMetamask });
            await this._unlockToken();
        }
    };

    public render = () => {
        const { context, token, isUnlocked } = this.props.step;
        const tokenSymbol = tokenSymbolToDisplayString(token.symbol);

        const { status } = this.state;
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

        return (
            <>
                <Title>{title}</Title>
                {content}
            </>
        );
    };

    private readonly _lockToken = async () => {
        const { step, advanceStep } = this.props;
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const lockTxHash = await this.props.lockToken(step.token);
            this.setState({ status: StepStatus.Loading });

            await web3Wrapper.awaitTransactionSuccessAsync(lockTxHash);
            this.setState({ status: StepStatus.Done });
            await sleep(DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
    };

    private readonly _unlockToken = async () => {
        const { step, advanceStep } = this.props;
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const unlockTxHash = await this.props.unlockToken(step.token);
            this.setState({ status: StepStatus.Loading });

            await web3Wrapper.awaitTransactionSuccessAsync(unlockTxHash);
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

        if (isUnlocked) {
            await this._lockToken();
        } else {
            await this._unlockToken();
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
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
