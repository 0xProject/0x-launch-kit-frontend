import React from 'react';
import { connect } from 'react-redux';

import { RELAYER_ERR, SIGNATURE_ERR } from '../../../exceptions/common';
import { RelayerException } from '../../../exceptions/relayer_exception';
import { SignatureFailedException } from '../../../exceptions/signature_failed_exception';
import { createConfigSignature, setDexName, submitConfigFile } from '../../../store/actions';
import { getEstimatedTxTimeMs, getStepsModalCurrentStep, getWallet } from '../../../store/selectors';
import { ConfigRelayerData, StepSubmitConfig, StoreState, Wallet } from '../../../util/types';

import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    estimatedTxTimeMs: number;
    step: StepSubmitConfig;
    wallet: Wallet;
}

interface DispatchProps {
    createConfigSignature: () => Promise<{ signature: string; message: string; owner: string }>;
    submitConfigFile: (config: ConfigRelayerData) => Promise<ConfigRelayerData>;
    onSetDexName: (name: string) => Promise<string>;
}

interface State {
    errorMsg: string;
    dexSlug: string | undefined;
}

type Props = OwnProps & StateProps & DispatchProps;

class SubmitConfigStep extends React.Component<Props, State> {
    public state = {
        errorMsg: 'Error signing/submitting config.',
        dexSlug: '',
    };
    public render = () => {
        const { buildStepsProgress, estimatedTxTimeMs, step, wallet } = this.props;
        const title = 'Config setup';
        const confirmCaption = `Confirm signature on ${wallet} to create/edit Dex.`;
        const loadingCaption = 'Submitting Dex.';
        const doneCaption = `Config submitted. Dex is created and you can visit it here at your defined domain or using dex=${this.state.dexSlug} at the url`;
        const errorCaption = this.state.errorMsg;
        const loadingFooterCaption = `Waiting for signature...`;
        const doneFooterCaption = `Dex Created/Edited`;

        return (
            <BaseStepModal
                buildStepsProgress={buildStepsProgress}
                confirmCaption={confirmCaption}
                doneCaption={doneCaption}
                doneFooterCaption={doneFooterCaption}
                errorCaption={errorCaption}
                estimatedTxTimeMs={estimatedTxTimeMs}
                loadingCaption={loadingCaption}
                loadingFooterCaption={loadingFooterCaption}
                runAction={this._getSubmitConfig}
                step={step}
                title={title}
                wallet={wallet}
            />
        );
    };

    private readonly _getSubmitConfig = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSetDexName } = this.props;
        const { config } = step;
        try {
            const { signature, message, owner } = await this.props.createConfigSignature();

            onLoading();
            const configData: ConfigRelayerData = {
                config: JSON.stringify(config),
                message,
                signature,
                owner,
            };
            const data = await this.props.submitConfigFile(configData);
            if (data) {
                const name = data.slug as string;
                await onSetDexName(name);
                this.setState({ dexSlug: name });
                onDone();
            } else {
                const errorException = new RelayerException(RELAYER_ERR);
                const errorMsg = RELAYER_ERR;
                this.setState(
                    {
                        errorMsg,
                    },
                    () => onError(errorException),
                );
            }
        } catch (error) {
            let errorException = error;
            if (error.message.toString().includes(SIGNATURE_ERR)) {
                // User denied signature
                errorException = new SignatureFailedException(error);
            }

            const errorMsg = error.message;
            this.setState(
                {
                    errorMsg,
                },
                () => onError(errorException),
            );
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        estimatedTxTimeMs: getEstimatedTxTimeMs(state),
        wallet: getWallet(state) as Wallet,
        step: getStepsModalCurrentStep(state) as StepSubmitConfig,
    };
};

const SubmitConfigStepContainer = connect(mapStateToProps, (dispatch: any) => {
    return {
        createConfigSignature: () => dispatch(createConfigSignature()),
        submitConfigFile: (config: ConfigRelayerData) => dispatch(submitConfigFile(config)),
        onSetDexName: (name: string) => dispatch(setDexName(name)),
    };
})(SubmitConfigStep);

export { SubmitConfigStep, SubmitConfigStepContainer };
