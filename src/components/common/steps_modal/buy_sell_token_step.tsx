import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { getOrderbookAndUserOrders, submitMarketOrder } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { OrderSide, StepBuySellMarket, StoreState } from '../../../util/types';

import {
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';

interface StateProps {
    step: StepBuySellMarket;
}

interface DispatchProps {
    submitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<any>;
    refreshOrders: () => any;
}

type Props = StateProps & DispatchProps;

interface State {
    status: StepStatus;
}

class BuySellTokenStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
    };

    public componentDidMount = async () => {
        await this._confirmOnMetamasBuyOrSell();
    };

    public render = () => {
        const { step } = this.props;
        const { status } = this.state;

        const isBuyOrSell = step.side === OrderSide.Buy;
        const amountOfTokenString = `${step.amount.toString()} of ${step.token.symbol.toUpperCase()}`;
        const retry = () => this._retry();

        let content;
        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        Processing {isBuyOrSell ? 'buy' : 'sale'} of {amountOfTokenString} .
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = <StepStatusDone>{isBuyOrSell ? 'Buy' : 'Sale'} complete!</StepStatusDone>;
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        Error {isBuyOrSell ? 'buying' : 'selling'} {amountOfTokenString}.{' '}
                        <em onClick={retry}>Click here to try again</em>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        Confirm on Metamask to {isBuyOrSell ? 'buy' : 'sell'} {amountOfTokenString}.
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

    private readonly _confirmOnMetamasBuyOrSell = async () => {
        const { amount, side } = this.props.step;
        const web3Wrapper = await getWeb3WrapperOrThrow();
        const fillOrdersTxHash = await this.props.submitMarketOrder(amount, side);
        this.setState({ status: StepStatus.Loading });
        try {
            await web3Wrapper.awaitTransactionMinedAsync(await fillOrdersTxHash);
            this.setState({ status: StepStatus.Done });
            this.props.refreshOrders();
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
        return fillOrdersTxHash;
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.Error });
        await this._confirmOnMetamasBuyOrSell();
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepBuySellMarket,
    };
};

const BuySellTokenStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            submitMarketOrder: (amount: BigNumber, side: OrderSide) => dispatch(submitMarketOrder(amount, side)),
            refreshOrders: () => dispatch(getOrderbookAndUserOrders()),
        };
    },
)(BuySellTokenStep);

export { BuySellTokenStep, BuySellTokenStepContainer };
