import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import {
    ETH_DECIMALS,
    STEP_MODAL_DONE_STATUS_VISIBILITY_TIME,
    UI_DECIMALS_DISPLAYED_ON_STEP_MODALS,
} from '../../../common/constants';
import {
    INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT,
    UNEXPECTED_ERROR,
    USER_DENIED_TRANSACTION_SIGNATURE_ERR,
} from '../../../exceptions/common';
import { ConvertBalanceMustNotBeEqualException } from '../../../exceptions/convert_balance_must_not_be_equal_exception';
import { InsufficientEthDepositBalanceException } from '../../../exceptions/insufficient_eth_deposit_balance_exception';
import { UserDeniedTransactionSignatureException } from '../../../exceptions/user_denied_transaction_exception';
import {
    convertBalanceStateAsync,
    stepsModalAdvanceStep,
    updateTokenBalances,
    updateWethBalance,
} from '../../../store/actions';
import { getEstimatedTxTimeMs, getEthBalance, getStepsModalCurrentStep } from '../../../store/selectors';
import { getKnownTokens } from '../../../util/known_tokens';
import { sleep } from '../../../util/sleep';
import { tokenAmountInUnits, tokenAmountInUnitsToBigNumber } from '../../../util/tokens';
import { StepWrapEth, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepWrapEth;
    ethBalance: BigNumber;
}

interface DispatchProps {
    updateWeth: (newWethBalance: BigNumber) => Promise<any>;
    updateTokenBalances: (txHash: string) => Promise<any>;
    convertBalanceState: { request: () => void; success: () => void; failure: () => void };
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
    errorCaption: string;
}

class WrapEthStep extends React.Component<Props, State> {
    public state = {
        errorCaption: '',
    };

    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step } = this.props;

        const { context, currentWethBalance, newWethBalance } = step;
        const amount = newWethBalance.minus(currentWethBalance);
        const wethToken = getKnownTokens().getWethToken();
        const ethAmount = tokenAmountInUnitsToBigNumber(amount.abs(), wethToken.decimals).toFixed(
            UI_DECIMALS_DISPLAYED_ON_STEP_MODALS,
        );

        const ethToWeth = amount.isGreaterThan(0);
        const convertingFrom = ethToWeth ? 'ETH' : 'wETH';
        const convertingTo = ethToWeth ? 'wETH' : 'ETH';

        const isOrder = context === 'order';

        const buildMessage = (prefix: string) => {
            return [
                prefix,
                ethAmount,
                convertingFrom,
                isOrder ? 'for trading' : null, // only show "for trading" when creating an order
                `(${convertingFrom} to ${convertingTo}).`,
            ]
                .filter(x => x !== null)
                .join(' ');
        };

        const title = `Convert ${convertingFrom}`;

        const confirmCaption = `Confirm on Metamask to convert ${ethAmount} ${convertingFrom} into ${convertingTo}.`;
        const loadingCaption = buildMessage('Converting');
        const doneCaption = buildMessage('Converted');
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `${convertingFrom} converted!`;

        return (
            <BaseStepModal
                step={step}
                title={title}
                confirmCaption={confirmCaption}
                loadingCaption={loadingCaption}
                doneCaption={doneCaption}
                errorCaption={this.state.errorCaption}
                loadingFooterCaption={loadingFooterCaption}
                doneFooterCaption={doneFooterCaption}
                buildStepsProgress={buildStepsProgress}
                estimatedTxTimeMs={estimatedTxTimeMs}
                runAction={this._convertWeth}
                showPartialProgress={true}
            />
        );
    };

    private readonly _convertWeth = async ({ onLoading, onDone, onError }: any) => {
        const { step, advanceStep, ethBalance, updateWeth, convertBalanceState } = this.props;
        const { currentWethBalance, newWethBalance } = step;
        const updateBalances = this.props.updateTokenBalances;
        try {
            const convertTxHash = await updateWeth(newWethBalance);
            onLoading();
            convertBalanceState.request();
            await updateBalances(convertTxHash);
            convertBalanceState.success();
            onDone();
            await sleep(STEP_MODAL_DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            let exception = err;
            let errorCaption = UNEXPECTED_ERROR;
            if (err.toString().includes(USER_DENIED_TRANSACTION_SIGNATURE_ERR)) {
                exception = new UserDeniedTransactionSignatureException();
                errorCaption = USER_DENIED_TRANSACTION_SIGNATURE_ERR;
            } else if (err.toString().includes(INSUFFICIENT_ETH_BALANCE_FOR_DEPOSIT)) {
                const amount = currentWethBalance.isGreaterThanOrEqualTo(newWethBalance)
                    ? currentWethBalance.minus(newWethBalance)
                    : newWethBalance.minus(currentWethBalance);
                const currentEthAmount = tokenAmountInUnits(ethBalance, ETH_DECIMALS);
                const ethNeeded = tokenAmountInUnits(amount, ETH_DECIMALS);
                exception = new InsufficientEthDepositBalanceException(currentEthAmount, ethNeeded);
                errorCaption = `You have ${currentEthAmount} ETH but you need ${ethNeeded} ETH to make this operation`;
            } else if (err instanceof ConvertBalanceMustNotBeEqualException) {
                exception = err;
                errorCaption =
                    'An unexpected error happened: tryed to wrap ETH so that the resulting ETH amount stays the same';
            }

            // Enable convert button: some conditions are dealt with exceptions and we don't
            // want to leave the button disabled
            convertBalanceState.success();

            this.setState({ errorCaption });
            onError(exception);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        step: getStepsModalCurrentStep(state) as StepWrapEth,
        ethBalance: getEthBalance(state),
    };
};

const WrapEthStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            updateWeth: (newWethBalance: BigNumber) => dispatch(updateWethBalance(newWethBalance)),
            updateTokenBalances: (txHash: string) => dispatch(updateTokenBalances(txHash)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
            convertBalanceState: {
                request: () => dispatch(convertBalanceStateAsync.request()),
                success: () => dispatch(convertBalanceStateAsync.success()),
                failure: () => dispatch(convertBalanceStateAsync.failure()),
            },
        };
    },
)(WrapEthStep);

export { WrapEthStep, WrapEthStepContainer };
