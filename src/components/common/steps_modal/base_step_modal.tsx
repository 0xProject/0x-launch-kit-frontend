import React from 'react';

import { getStepTitle, isLongStep, makeGetProgress } from '../../../util/steps';
import { Step } from '../../../util/types';

import { StepPendingTime } from './step_pending_time';
import {
    ModalStatusTextLight,
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

type RunAction = ({
    onLoading,
    onDone,
    onError,
}: {
    onLoading: () => any;
    onDone: () => any;
    onError: () => any;
}) => Promise<any>;

interface Props {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
    estimatedTxTimeMs: number;
    runAction: RunAction;
    title: string;
    confirmCaption: string;
    loadingCaption: string;
    loadingFooterCaption: string;
    doneFooterCaption: string;
    doneCaption: string;
    errorCaption: string;
    step: Step;
    showPartialProgress?: boolean;
}

interface State {
    status: StepStatus;
    loadingStarted: number | null;
}

export class BaseStepModal extends React.Component<Props, State> {
    public state: State = {
        status: StepStatus.ConfirmOnMetamask,
        loadingStarted: null,
    };

    private readonly _estimatedTxTimeMs: number;

    constructor(props: Props) {
        super(props);

        // we set the value of the estimated tx time, so that the progress bar length is not updated in the middle of the step
        this._estimatedTxTimeMs = props.estimatedTxTimeMs;
    }

    public componentDidMount = async () => {
        await this._runAction();
    };

    public render = () => {
        const {
            confirmCaption,
            loadingCaption,
            doneCaption,
            errorCaption,
            loadingFooterCaption,
            doneFooterCaption,
            title,
        } = this.props;
        const { loadingStarted, status } = this.state;
        const retry = () => this._retry();
        let content;
        let footer;
        switch (status) {
            case StepStatus.Loading:
                content = (
                    <StepStatusLoading>
                        <ModalText>{loadingCaption}</ModalText>
                    </StepStatusLoading>
                );
                break;
            case StepStatus.Done:
                content = (
                    <StepStatusDone>
                        <ModalText>{doneCaption}</ModalText>
                    </StepStatusDone>
                );
                footer = <ModalStatusTextLight>{doneFooterCaption}</ModalStatusTextLight>;
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            {errorCaption}{' '}
                            <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                        </ModalText>
                    </StepStatusError>
                );
                break;
            default:
                content = (
                    <StepStatusConfirmOnMetamask>
                        <ModalText>{confirmCaption}</ModalText>
                    </StepStatusConfirmOnMetamask>
                );
                footer = <ModalStatusTextLight>{loadingFooterCaption}</ModalStatusTextLight>;
                break;
        }

        let getProgress: GetProgress = () => 0;
        if (status === StepStatus.Loading && this.props.showPartialProgress && loadingStarted !== null) {
            getProgress = makeGetProgress(loadingStarted, this._estimatedTxTimeMs);
        } else if (status === StepStatus.Done) {
            getProgress = () => 100;
        }

        const stepsProgress = this.props.buildStepsProgress({
            title: getStepTitle(this.props.step),
            active: true,
            progress: getProgress,
            isLong: isLongStep(this.props.step),
        });

        return (
            <>
                <Title>{title}</Title>
                {content}
                <StepsProgress steps={stepsProgress} />
                {this.props.showPartialProgress && (
                    <StepPendingTime
                        txStarted={loadingStarted}
                        stepStatus={status}
                        estimatedTxTimeMs={this._estimatedTxTimeMs}
                    />
                )}
                {footer}
            </>
        );
    };

    private readonly _runAction = async () => {
        const onLoading = () =>
            this.setState({
                status: StepStatus.Loading,
                loadingStarted: Date.now(),
            });
        const onDone = () =>
            this.setState({
                status: StepStatus.Done,
            });
        const onError = () =>
            this.setState({
                status: StepStatus.Error,
            });

        return this.props.runAction({
            onLoading,
            onDone,
            onError,
        });
    };

    private readonly _retry = async () => {
        this.setState({ status: StepStatus.ConfirmOnMetamask });

        await this._runAction();
    };
}
