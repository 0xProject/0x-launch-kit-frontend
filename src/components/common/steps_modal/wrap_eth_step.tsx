import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { addWethToBalance, stepsModalAdvanceStep } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepWrapEth, StoreState } from '../../../util/types';

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
        const ethAmount = amount.toString();
        const { status } = this.state;
        const retry = () => this._retry();
        let content;
        switch (status) {
            case StepStatus.Loading:
                content = <StepStatusLoading>Converting {ethAmount} ETH for trading (ETH to wETH).</StepStatusLoading>;
                break;
            case StepStatus.Done:
                content = <StepStatusDone>Converted {ethAmount} ETH for trading (ETH to wETH).</StepStatusDone>;
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        Error converting {ethAmount} ETH for trading (ETH to wETH).{' '}
                        <em onClick={retry}>Click here to try again</em>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        Confirm on Metamask to convert {ethAmount} ETH into wETH.
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
        const convertPromise = this.props.convertWeth(amount);
        this.setState({ status: StepStatus.Loading });
        try {
            await convertPromise;
            this.setState({ status: StepStatus.Done });
            setTimeout(advanceStep, DONE_STATUS_VISIBILITY_TIME);
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
        return convertPromise;
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
