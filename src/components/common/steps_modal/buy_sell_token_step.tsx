import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { getOrderbookAndUserOrders, submitMarketOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { addMarketBuySellNotification } from '../../../store/ui/actions';
import { getStepTitle, makeGetProgress } from '../../../util/steps';
import { tokenAmountInUnitsToBigNumber, tokenSymbolToDisplayString } from '../../../util/tokens';
import { OrderSide, StepBuySellMarket, StoreState, Token } from '../../../util/types';

import { StepPendingTime } from './step_pending_time';
import {
    ModalText,
    ModalTextClickable,
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
    step: StepBuySellMarket;
}

interface DispatchProps {
    submitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<any>;
    refreshOrders: () => any;
    notifyBuySellMarket: (amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    status: StepStatus;
    txStarted: number | null;
}

class BuySellTokenStep extends React.Component<Props, State> {
    public state = {
        status: StepStatus.ConfirmOnMetamask,
        txStarted: null,
    };

    public componentDidMount = async () => {
        await this._confirmOnMetamasBuyOrSell();
    };

    public render = () => {
        const { estimatedTxTimeMs, step } = this.props;
        const { status, txStarted } = this.state;

        const isBuyOrSell = step.side === OrderSide.Buy;
        const tokenSymbol = tokenSymbolToDisplayString(step.token.symbol);

        const amountOfTokenString = `${tokenAmountInUnitsToBigNumber(
            step.amount,
            step.token.decimals,
        ).toString()} of ${tokenSymbol}`;
        const retry = () => this._retry();

        let content;
        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>
                            Processing {isBuyOrSell ? 'buy' : 'sale'} of {amountOfTokenString}.
                        </ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>{isBuyOrSell ? 'Buy' : 'Sale'} complete!</ModalText>
                    </StepStatusDone>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            Error {isBuyOrSell ? 'buying' : 'selling'} {amountOfTokenString}.{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>
                            Confirm on Metamask to {isBuyOrSell ? 'buy' : 'sell'} {amountOfTokenString}.
                        </ModalText>
                    </StepStatusConfirmOnMetamask>
                );
                break;
        }

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
                <Title>Order Setup</Title>
                {content}
                <StepsProgress steps={stepsProgress} />
                <StepPendingTime txStarted={txStarted} stepStatus={status} estimatedTxTimeMs={estimatedTxTimeMs} />
            </>
        );
    };

    private readonly _confirmOnMetamasBuyOrSell = async () => {
        const { amount, side, token } = this.props.step;
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const fillOrdersTxHash = await this.props.submitMarketOrder(amount, side);
            this.setState({ status: StepStatus.Loading, txStarted: Date.now() });

            await web3Wrapper.awaitTransactionSuccessAsync(fillOrdersTxHash);

            this.setState({ status: StepStatus.Done });
            this.props.notifyBuySellMarket(amount, token, side, Promise.resolve());
            this.props.refreshOrders();
        } catch (err) {
            this.setState({ status: StepStatus.Error });
        }
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.Error });
        await this._confirmOnMetamasBuyOrSell();
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepBuySellMarket,
    };
};

const BuySellTokenStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            submitMarketOrder: (amount: BigNumber, side: OrderSide) => dispatch(submitMarketOrder(amount, side)),
            notifyBuySellMarket: (amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) =>
                dispatch(addMarketBuySellNotification(amount, token, side, tx)),
            refreshOrders: () => dispatch(getOrderbookAndUserOrders()),
        };
    },
)(BuySellTokenStep);

export { BuySellTokenStep, BuySellTokenStepContainer };
