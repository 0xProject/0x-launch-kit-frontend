import React from 'react';

import { getStepTitle, makeGetProgress } from '../../../util/steps';
import { Step } from '../../../util/types';

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
    doneCaption: string;
    errorCaption: string;
    step: Step;
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

    public componentDidMount = async () => {
        await this._runAction();
    };

    public render = () => {
        const { confirmCaption, estimatedTxTimeMs, loadingCaption, doneCaption, errorCaption, title } = this.props;

        const { loadingStarted, status } = this.state;
        const retry = () => this._retry();
        let content;

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
                break;
        }

        let getProgress: GetProgress = () => 0;
        if (status === StepStatus.Loading && loadingStarted !== null) {
            getProgress = makeGetProgress(loadingStarted, estimatedTxTimeMs);
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
                <Title>{title}</Title>
                {content}
                <StepsProgress steps={stepsProgress} />
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
        this.setState({ status: StepStatus.Error });

        await this._runAction();
    };
}
