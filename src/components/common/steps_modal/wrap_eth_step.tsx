import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { addWethToBalance, stepsModalAdvanceStep } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { getKnownTokens } from '../../../util/known_tokens';
import { tokenAmountInUnitsToBigNumber } from '../../../util/tokens';
import { StepWrapEth, StoreState } from '../../../util/types';

import {
    DONE_STATUS_VISIBILITY_TIME,
    ModalText,
    ModalTextClickable,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';

interface StateProps {
    step: StepWrapEth;
}

interface DispatchProps {
    convertWeth: (amount: BigNumber) => Promise<any>;
    advanceStep: () => void;
}

type Props = StateProps & DispatchProps;

interface State {
    status: StepStatus;
}

class WrapEthStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
    };

    public componentDidMount = async () => {
        await this._convertWeth();
    };

    public render = () => {
        const { amount } = this.props.step;
        const wethToken = getKnownTokens().getWethToken();
        const ethAmount = tokenAmountInUnitsToBigNumber(amount, wethToken.decimals).toString();
        const { status } = this.state;
        const retry = () => this._retry();
        let content;

        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>Converting {ethAmount} ETH for trading (ETH to wETH).</ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>Converted {ethAmount} ETH for trading (ETH to wETH).</ModalText>
                    </StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            Error converting {ethAmount} ETH for trading (ETH to wETH).{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>Confirm on Metamask to convert {ethAmount} ETH into wETH.</ModalText>
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

    private readonly _convertWeth = async () => {
        const { step, advanceStep } = this.props;
        const { amount } = step;
        const web3Wrapper = await getWeb3WrapperOrThrow();
        const convertTxHash = await this.props.convertWeth(amount);
        this.setState({ status: StepStatus.Loading });
        try {
            await web3Wrapper.awaitTransactionSuccessAsync(convertTxHash);
            this.setState({ status: StepStatus.Done });
            setTimeout(advanceStep, DONE_STATUS_VISIBILITY_TIME);
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
        return convertTxHash;
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.Error });
        await this._convertWeth();
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepWrapEth,
    };
};

const WrapEthStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            convertWeth: (amount: BigNumber) => dispatch(addWethToBalance(amount)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(WrapEthStep);

export { WrapEthStep, WrapEthStepContainer };
