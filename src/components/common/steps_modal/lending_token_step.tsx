import { BigNumber } from '@0x/utils';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { lendingToken, unLendingToken, updateITokenBalance, updateTokenBalance } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep, getWallet } from '../../../store/selectors';
import { addLendingTokenNotification, addUnLendingTokenNotification } from '../../../store/ui/actions';
import { tokenAmountInUnits, tokenSymbolToDisplayString } from '../../../util/tokens';
import { iTokenData, StepLendingToken, StepUnLendingToken, StoreState, Token, Wallet } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}

interface StateProps {
    estimatedTxTimeMs: number;
    step: StepLendingToken | StepUnLendingToken;
    wallet: Wallet;
}

interface DispatchProps {
    onSubmitLendingToken: (token: Token, iToken: iTokenData, amount: BigNumber, isEth: boolean) => Promise<any>;
    onSubmitUnLendingToken: (token: Token, iToken: iTokenData, amount: BigNumber, isEth: boolean) => Promise<any>;
    notifyLendingToken: (id: string, amount: BigNumber, token: Token, tx: Promise<any>) => any;
    notifyUnLendingToken: (id: string, amount: BigNumber, token: Token, tx: Promise<any>) => any;
    updateITokenBalance: (token: iTokenData) => any;
    updateTokenBalance: (token: Token) => any;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    amountInReturn: BigNumber | null;
}

class LendingTokenStep extends React.Component<Props, State> {
    public state = {
        amountInReturn: null,
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step, wallet } = this.props;
        const { token, isEth, isLending } = step;
        const coinSymbol = isEth ? tokenSymbolToDisplayString('ETH') : tokenSymbolToDisplayString(token.symbol);
        const decimals = isEth ? 18 : step.token.decimals;

        const amountOfTokenString = `${tokenAmountInUnits(
            step.amount,
            decimals,
            step.token.displayDecimals,
        ).toString()} ${coinSymbol}`;

        const title = isLending ? 'Lending' : 'Unlending';

        const confirmCaption = `Confirm on ${wallet} to ${isLending ? 'lend' : 'unlend'} ${amountOfTokenString}.`;
        const loadingCaption = `Processing ${isLending ? 'Lending' : 'Unlending'} ${amountOfTokenString}.`;
        const doneCaption = `${isLending ? 'Lending' : 'Unlending'} Complete!`;
        const errorCaption = `${isLending ? 'Lending' : 'Unlending'} ${amountOfTokenString}.`;
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `${isLending ? 'Lending' : 'Unlending'} of ${amountOfTokenString}.`;

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
                runAction={this._confirmOnWalletLending}
                showPartialProgress={true}
                wallet={wallet}
            />
        );
    };

    private readonly _confirmOnWalletLending = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSubmitLendingToken, onSubmitUnLendingToken } = this.props;
        const { amount, token, isEth, iToken, isLending } = step;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const txHash = isLending
                ? await onSubmitLendingToken(token, iToken, amount, isEth)
                : await onSubmitUnLendingToken(token, iToken, amount, isEth);

            onLoading();
            await web3Wrapper.awaitTransactionSuccessAsync(txHash);
            onDone();
            if (isLending) {
                this.props.notifyLendingToken(txHash, amount, token, Promise.resolve());
            } else {
                this.props.notifyUnLendingToken(txHash, amount, token, Promise.resolve());
            }
            setTimeout(() => {
                this.props.updateITokenBalance(iToken);
                this.props.updateTokenBalance(token);
            }, 1000);
        } catch (err) {
            onError(err);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepLendingToken | StepUnLendingToken,
        wallet: getWallet(state) as Wallet,
    };
};

const LendingTokenStepContainer = connect(mapStateToProps, (dispatch: any) => {
    return {
        onSubmitLendingToken: (token: Token, iToken: iTokenData, amount: BigNumber, isEth: boolean) =>
            dispatch(lendingToken(token, iToken, amount, isEth)),
        onSubmitUnLendingToken: (token: Token, iToken: iTokenData, amount: BigNumber, isEth: boolean) =>
            dispatch(unLendingToken(token, iToken, amount, isEth)),
        notifyLendingToken: (id: string, amount: BigNumber, token: Token, tx: Promise<any>) =>
            dispatch(addLendingTokenNotification(id, amount, token, tx)),
        notifyUnLendingToken: (id: string, amount: BigNumber, token: Token, tx: Promise<any>) =>
            dispatch(addUnLendingTokenNotification(id, amount, token, tx)),
        updateITokenBalance: (token: iTokenData) => dispatch(updateITokenBalance(token)),
        updateTokenBalance: (token: Token) => dispatch(updateTokenBalance(token)),
    };
})(LendingTokenStep);

export { LendingTokenStep, LendingTokenStepContainer };
