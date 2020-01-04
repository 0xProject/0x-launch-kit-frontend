import { BigNumber } from '@0x/utils';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { transferToken, updateTokenBalance } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep, getWallet } from '../../../store/selectors';
import { addTransferTokenNotification } from '../../../store/ui/actions';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { StepTransferToken, StoreState, Token, Wallet } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepTransferToken;
    wallet: Wallet;
}

interface DispatchProps {
    onSubmitTransferToken: (token: Token, amount: BigNumber, address: string, isEth: boolean) => Promise<any>;
    notifyTransferToken: (id: string, amount: BigNumber, token: Token, address: string, tx: Promise<any>) => any;
    updateTokenBalance: (token: Token) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class TransferTokenStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step, wallet } = this.props;
        const { token, address, isEth } = step;
        const coinSymbol = isEth ? tokenSymbolToDisplayString('ETH') : tokenSymbolToDisplayString(token.symbol);
        const decimals = isEth ? 18 : step.token.decimals;

        const amountOfTokenString = `${tokenAmountInUnits(
            step.amount,
            decimals,
            step.token.displayDecimals,
        ).toString()} ${coinSymbol}`;

        const title = 'Transfer';

        const confirmCaption = `Confirm on ${wallet} to Transfer ${amountOfTokenString} to ${address}.`;
        const loadingCaption = `Processing Transfer of ${amountOfTokenString} to ${address}.`;
        const doneCaption = `Transfer Complete!`;
        const errorCaption = `Sending ${amountOfTokenString} to ${address}.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `Transfer of ${amountOfTokenString} to ${address} sent.`;

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
                runAction={this._confirmOnWalletTranfer}
                showPartialProgress={true}
                wallet={wallet}
            />
        );
    };

    private readonly _confirmOnWalletTranfer = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSubmitTransferToken } = this.props;
        const { amount, token, address, isEth } = step;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash = await onSubmitTransferToken(token, amount, address, isEth);
            onLoading();
            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            onDone();
            this.props.notifyTransferToken(txHash, amount, token, address, Promise.resolve());
            this.props.updateTokenBalance(token);
        } catch (err) {
            onError(err);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepTransferToken,
        wallet: getWallet(state) as Wallet,
    };
};

const TransferTokenStepContainer = connect(mapStateToProps, (dispatch: any) => {
    return {
        onSubmitTransferToken: (token: Token, amount: BigNumber, address: string, isEth: boolean) =>
            dispatch(transferToken(token, amount, address, isEth)),
        notifyTransferToken: (id: string, amount: BigNumber, token: Token, address: string, tx: Promise<any>) =>
            dispatch(addTransferTokenNotification(id, amount, token, address, tx)),
        updateTokenBalance: (token: Token) => dispatch(updateTokenBalance(token)),
    };
})(TransferTokenStep);

export { TransferTokenStep, TransferTokenStepContainer };
