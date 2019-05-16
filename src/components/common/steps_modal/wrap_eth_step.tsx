import { BigNumber } from '0x.js';
import React from 'react';
import { connect } from 'react-redux';

import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { stepsModalAdvanceStep, updateWethBalance } from '../../../store/actions';
import { getEstimatedTxTimeMs, getNetworkId, getStepsModalCurrentStep } from '../../../store/selectors';
import { getKnownTokens } from '../../../util/known_tokens';
import { sleep } from '../../../util/sleep';
import { tokenAmountInUnitsToBigNumber } from '../../../util/tokens';
import { StepWrapEth, StoreState } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { DONE_STATUS_VISIBILITY_TIME } from './steps_common';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    networkId: number | null;
    step: StepWrapEth;
}

interface DispatchProps {
    updateWeth: (newWethBalance: BigNumber) => Promise<any>;
    advanceStep: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class WrapEthStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, networkId, step } = this.props;

        if (networkId === null) {
            return null;
        }

        const { context, currentWethBalance, newWethBalance } = step;
        const amount = newWethBalance.minus(currentWethBalance);
        const wethToken = getKnownTokens(networkId).getWethToken();
        const ethAmount = tokenAmountInUnitsToBigNumber(amount.abs(), wethToken.decimals).toString();

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

        const title = 'Order setup';

        const confirmCaption = `Confirm on Metamask to convert ${ethAmount} ${convertingFrom} into ${convertingTo}.`;
        const loadingCaption = buildMessage('Converting');
        const doneCaption = buildMessage('Converted');
        const errorCaption = buildMessage('Error converting');
        const loadingFooterCaption = `Waiting for confirmation....`;
        const doneFooterCaption = `${convertingFrom} converted!`;

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
                runAction={this._convertWeth}
                showPartialProgress={true}
            />
        );
    };

    private readonly _convertWeth = async ({ onLoading, onDone, onError }: any) => {
        const { step, advanceStep } = this.props;
        const { newWethBalance } = step;
        try {
            const web3Wrapper = await getWeb3Wrapper();
            const convertTxHash = await this.props.updateWeth(newWethBalance);
            onLoading();

            await web3Wrapper.awaitTransactionSuccessAsync(convertTxHash);
            onDone();
            await sleep(DONE_STATUS_VISIBILITY_TIME);
            advanceStep();
        } catch (err) {
            onError(err);
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        networkId: getNetworkId(state),
        step: getStepsModalCurrentStep(state) as StepWrapEth,
    };
};

const WrapEthStepContainer = connect(
    mapStateToProps,
    (dispatch: any) => {
        return {
            updateWeth: (newWethBalance: BigNumber) => dispatch(updateWethBalance(newWethBalance)),
            advanceStep: () => dispatch(stepsModalAdvanceStep()),
        };
    },
)(WrapEthStep);

export { WrapEthStep, WrapEthStepContainer };
