import { BigNumber } from '@0x/utils';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { getOrderbookAndUserOrders, submitLimitMatchingOrder } from '../../../store/actions';
import {
    getCurrencyPair,
    getEstimatedTxTimeMs,
    getQuoteToken,
    getStepsModalCurrentStep,
    getWallet,
} from '../../../store/selectors';
import { addMarketBuySellNotification } from '../../../store/ui/actions';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { CurrencyPair, OrderSide, StepBuySellLimitMatching, StoreState, Token, Wallet } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepBuySellLimitMatching;
    quoteToken: Token;
    wallet: Wallet;
    currencyPair: CurrencyPair;
}

interface DispatchProps {
    onSubmitLimitMatchingOrder: (
        amount: BigNumber,
        price: BigNumber,
        side: OrderSide,
    ) => Promise<{ txHash: string; amountInReturn: BigNumber }>;
    refreshOrders: () => any;
    notifyBuySellMarket: (id: string, amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class BuySellTokenMatchingStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step, wallet, currencyPair, quoteToken } = this.props;
        const { token } = step;
        const tokenSymbol = tokenSymbolToDisplayString(token.symbol);

        const isBuy = step.side === OrderSide.Buy;
        const amountOfTokenString = `${tokenAmountInUnits(
            step.amount,
            step.token.decimals,
            step.token.displayDecimals,
        ).toString()} ${tokenSymbol}`;

        const quoteSymbol = tokenSymbolToDisplayString(quoteToken.symbol);

        const priceDisplay = step.price_avg.toFixed(currencyPair.config.pricePrecision);

        const title = 'Order setup';

        const confirmCaption = `Confirm on ${wallet} to ${
            isBuy ? 'buy' : 'sell'
        } ${amountOfTokenString} with price ${priceDisplay} ${quoteSymbol}.`;
        const loadingCaption = `Processing ${
            isBuy ? 'buy' : 'sale'
        } of ${amountOfTokenString} with price ${priceDisplay} ${quoteSymbol}.`;
        const doneCaption = `${isBuy ? 'Buy' : 'Sell'} Order Complete!`;
        const errorCaption = `${
            isBuy ? 'buying' : 'selling'
        } ${amountOfTokenString} with price ${priceDisplay} ${quoteSymbol}.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `${isBuy ? amountOfTokenString : this._getAmountOfQuoteTokenString()} received`;

        return (
            <BaseStepModal
                step={step}
                title={title}
                confirmCaption={confirmCaption}
                loadingCaption={loadingCaption}
                doneCaption={doneCaption}
                errorCaption={errorCaption}
                loadingFooterCaption={loadingFooterCaption}
                doneFooterCaption={doneFooterCaption}
                buildStepsProgress={buildStepsProgress}
                estimatedTxTimeMs={estimatedTxTimeMs}
                runAction={this._confirmOnMetamaskBuyOrSell}
                showPartialProgress={true}
                wallet={wallet}
            />
        );
    };

    private readonly _confirmOnMetamaskBuyOrSell = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSubmitLimitMatchingOrder } = this.props;
        const { amount, side, token, price } = step;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const { txHash, amountInReturn } = await onSubmitLimitMatchingOrder(amount, price, side);
            this.setState({ amountInReturn });
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(txHash);

            onDone();
            this.props.notifyBuySellMarket(txHash, amount, token, side, Promise.resolve());
            this.props.refreshOrders();
        } catch (err) {
            onError(err);
        }
    };

    private readonly _getAmountOfQuoteTokenString = (): string => {
        const { quoteToken } = this.props;
        const quoteTokenSymbol = tokenSymbolToDisplayString(quoteToken.symbol);
        const { amountInReturn } = this.state;
        return `${tokenAmountInUnits(
            amountInReturn || new BigNumber(0),
            quoteToken.decimals,
            quoteToken.displayDecimals,
        ).toString()} ${quoteTokenSymbol}`;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepBuySellLimitMatching,
        quoteToken: getQuoteToken(state) as Token,
        wallet: getWallet(state) as Wallet,
        currencyPair: getCurrencyPair(state),
    };
};

const BuySellTokenMatchingStepContainer = connect(mapStateToProps, (dispatch: any) => {
    return {
        onSubmitLimitMatchingOrder: (amount: BigNumber, price: BigNumber, side: OrderSide) =>
            dispatch(submitLimitMatchingOrder(amount, price, side)),
        notifyBuySellMarket: (id: string, amount: BigNumber, token: Token, side: OrderSide, tx: Promise<any>) =>
            dispatch(addMarketBuySellNotification(id, amount, token, side, tx)),
        refreshOrders: () => dispatch(getOrderbookAndUserOrders()),
    };
})(BuySellTokenMatchingStep);

export { BuySellTokenMatchingStep, BuySellTokenMatchingStepContainer };
