import React from 'react';
import { connect } from 'react-redux';

import { WETH_TOKEN_SYMBOL } from '../../../common/constants';
import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { stepsModalAdvanceStep, unlockToken } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepUnlockToken, StoreState, Token } from '../../../util/types';

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

    public componentDidUpdate = async (prevProps: Props) => {
        // If there are consecutive StepUnlockToken in the flow, this will force the step "restart"
        if (this.props.step.token.address !== prevProps.step.token.address) {
            this.setState({ status: StepStatus.ConfirmOnMetamask });
            await this._unlockToken();
        }
    };

    public render = () => {
        const { token } = this.props.step;
        let tokenSymbol = token.symbol.toUpperCase();
        if (tokenSymbol === WETH_TOKEN_SYMBOL.toUpperCase()) {
            tokenSymbol = 'wETH';
        }

        const { status } = this.state;
        const retry = () => this._retry();
        let content;

        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>Unlocking {tokenSymbol}. It will remain unlocked for future trades</ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>Unlocked {tokenSymbol}. It will remain unlocked for future trades</ModalText>
                    </StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            Unlocking {tokenSymbol} for future trades failed.{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>Confirm on Metamask to unlock {tokenSymbol} for trading on 0x.</ModalText>
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
