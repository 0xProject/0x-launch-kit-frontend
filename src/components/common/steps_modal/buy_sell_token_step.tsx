import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3WrapperOrThrow } from '../../../services/web3_wrapper';
import { getOrderbookAndUserOrders, submitMarketOrder } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep } from '../../../store/selectors';
import { addMarketBuySellNotification } from '../../../store/ui/actions';
import { tokenAmountInUnitsToBigNumber, tokenSymbolToDisplayString } from '../../../util/tokens';
import { OrderSide, StepBuySellMarket, StoreState, Token } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepBuySellMarket;
}

interface DispatchProps {
    onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => Promise<any>;
    refreshOrders: () => any;
    notifyBuySellMarket: (amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

class BuySellTokenStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;
        const { token } = step;
        const tokenSymbol = tokenSymbolToDisplayString(token.symbol);

        const isBuyOrSell = step.side === OrderSide.Buy;
        const amountOfTokenString = `${tokenAmountInUnitsToBigNumber(
            step.amount,
            step.token.decimals,
        ).toString()} of ${tokenSymbol}`;

        const title = 'Order setup';

        const confirmCaption = `Confirm on Metamask to ${isBuyOrSell ? 'buy' : 'sell'} ${amountOfTokenString}.`;
        const loadingCaption = `Processing ${isBuyOrSell ? 'buy' : 'sale'} of ${amountOfTokenString}.`;
        const doneCaption = `${isBuyOrSell ? 'Buy' : 'Sale'} complete!`;
        const errorCaption = `${isBuyOrSell ? 'buying' : 'selling'} ${amountOfTokenString}.`;

        return (
            <BaseStepModal
                step={step}
                title={title}
                confirmCaption={confirmCaption}
                loadingCaption={loadingCaption}
                doneCaption={doneCaption}
                errorCaption={errorCaption}
                buildStepsProgress={buildStepsProgress}
                estimatedTxTimeMs={estimatedTxTimeMs}
                runAction={this._confirmOnMetamaskBuyOrSell}
            />
        );
    };

    private readonly _confirmOnMetamaskBuyOrSell = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSubmitMarketOrder } = this.props;
        const { amount, side, token } = step;
        try {
            const web3Wrapper = await getWeb3WrapperOrThrow();
            const fillOrdersTxHash = await onSubmitMarketOrder(amount, side);
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(fillOrdersTxHash);

            onDone();
            this.props.notifyBuySellMarket(amount, token, side, Promise.resolve());
            this.props.refreshOrders();
        } catch (err) {
            onError();
        }
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
            onSubmitMarketOrder: (amount: BigNumber, side: OrderSide) => dispatch(submitMarketOrder(amount, side)),
            notifyBuySellMarket: (amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) =>
                dispatch(addMarketBuySellNotification(amount, token, side, tx)),
            refreshOrders: () => dispatch(getOrderbookAndUserOrders()),
        };
    },
)(BuySellTokenStep);

export { BuySellTokenStep, BuySellTokenStepContainer };
