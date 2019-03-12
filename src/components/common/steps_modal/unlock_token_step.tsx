import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { stepsModalAdvanceStep, unlockToken } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepUnlockToken, StoreState, Token } from '../../../util/types';

import {
    DONE_STATUS_VISIBILITY_TIME,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';

interface StateProps {
    step: StepUnlockToken;
}

interface DispatchProps {
    unlockToken: (token: Token) => Promise<any>;
    advanceStep: () => void;
}

type Props = StateProps & DispatchProps;

interface State {
    status: StepStatus;
}

class UnlockTokensStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
    };

    public componentDidMount = async () => {
        await this._unlockToken();
    };

    public render = () => {
        const { token } = this.props.step;
        const tokenSymbol = token.symbol.toUpperCase();

        const { status } = this.state;
        const retry = () => this._retry();
        let content;
        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        Unlocking {tokenSymbol}. It will remain unlocked for future trades
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>Unlocked {tokenSymbol}. It will remain unlocked for future trades</StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        Unlocking {tokenSymbol} for future trades failed.{' '}
                        <em onClick={retry}>Click here to try again</em>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        Confirm on Metamask to unlock {tokenSymbol} for trading on 0x.
                    </StepStatusConfirmOnMetamask>
                );
                break;
        }
        return (
            <>
                <Title>Order Setup</Title>
                {content}
            </>
        );
    };

    private readonly _unlockToken = async () => {
        const { step, advanceStep } = this.props;
        const web3Wrapper = await getWeb3WrapperOrThrow();
        const unlockTxHash = await this.props.unlockToken(step.token);
        this.setState({ status: StepStatus.Loading });
        try {
            await web3Wrapper.awaitTransactionMinedAsync(await unlockTxHash);
            this.setState({ status: StepStatus.Done });
            setTimeout(advanceStep, DONE_STATUS_VISIBILITY_TIME);
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
        return unlockTxHash;
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.Error });
        await this._unlockToken();
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepUnlockToken,
    };
};

const UnlockTokensStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            unlockToken: (token: Token) => dispatch(unlockToken(token)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(UnlockTokensStep);

export { UnlockTokensStep, UnlockTokensStepContainer };
