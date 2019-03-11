import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { addWethToBalance, stepsModalAdvanceStep } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepWrapEth, StoreState } from '../../../util/types';

// In milliseconds
const DONE_STATUS_VISIBILITY_TIME: number = 4000;

interface StateProps {
    step: StepWrapEth;
}

interface DispatchProps {
    convertWeth: (amount: BigNumber) => Promise<any>;
    advanceStep: () => void;
}

type Props = StateProps & DispatchProps;

enum StepStatus {
    Initial,
    Loading,
    Done,
    Error,
}

interface State {
    status: StepStatus;
}

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

class WrapEthStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.Initial,
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
                content = <p>Converting {ethAmount} ETH for trading (ETH to wETH).</p>;
                break;
            case StepStatus.Done:
                content = <p>Converted {ethAmount} ETH for trading (ETH to wETH).</p>;
                break;
            case StepStatus.Error:
                content = (
                    <p>
                        Error convertint {ethAmount} ETH for trading (ETH to wETH).{' '}
                        <em onClick={retry}>Click here to try again</em>
                    </p>
                );
                break;
            default:
                content = <p>Confirm on Metamask to convert {ethAmount} ETH into wETH.</p>;
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
