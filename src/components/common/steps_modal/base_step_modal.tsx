import React from 'react';

import { ComponentUnmountedException } from '../../../exceptions/component_unmounted_exception';
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
    onError: (err: Error | ComponentUnmountedException) => any;
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
    private _isUnmounted: boolean = false;

    constructor(props: Props) {
        super(props);

        // we set the value of the estimated tx time, so that the progress bar length is not updated in the middle of the step
        this._estimatedTxTimeMs = props.estimatedTxTimeMs;
    }

    public componentDidMount = async () => {
        await this._runAction();
    };

    public componentWillUnmount = () => {
        this._isUnmounted = true;
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
        let bodyText;
        let footer = this.props.showPartialProgress ? null : <ModalStatusTextLight>{}</ModalStatusTextLight>;
        switch (status) {
            case StepStatus.Loading:
                content = <StepStatusLoading />;
                bodyText = <ModalText>{loadingCaption}</ModalText>;
                break;
            case StepStatus.Done:
                content = <StepStatusDone />;
                bodyText = <ModalText>{doneCaption}</ModalText>;
                footer = <ModalStatusTextLight>{doneFooterCaption}</ModalStatusTextLight>;
                break;
            case StepStatus.Error:
                content = <StepStatusError />;
                bodyText = (
                    <ModalText>
                        {errorCaption}
                        <br />
                        <ModalTextClickable onClick={retry}>Click here to try again</ModalTextClickable>
                    </ModalText>
                );
                break;
            default:
                content = <StepStatusConfirmOnMetamask />;
                bodyText = <ModalText>{confirmCaption}</ModalText>;
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
                {content}
                <Title>{title}</Title>
                {bodyText}
                <StepsProgress steps={stepsProgress} />
                {this.props.showPartialProgress && (
                    <ModalStatusTextLight>
                        <StepPendingTime
                            txStarted={loadingStarted}
                            stepStatus={status}
                            estimatedTxTimeMs={this._estimatedTxTimeMs}
                        />
                    </ModalStatusTextLight>
                )}
                {footer}
            </>
        );
    };

    private readonly _runAction = async () => {
        const onLoading = () => {
            this._throwIfUnmounted();
            this.setState({
                status: StepStatus.Loading,
                loadingStarted: Date.now(),
            });
        };
        const onDone = () => {
            this._throwIfUnmounted();
            this.setState({
                status: StepStatus.Done,
            });
        };
        const onError = (err: Error | ComponentUnmountedException) => {
            if (err instanceof ComponentUnmountedException) {
                return;
            }
            this.setState({
                status: StepStatus.Error,
            });
        };

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

    private readonly _throwIfUnmounted = () => {
        if (this._isUnmounted) {
            throw new ComponentUnmountedException('BaseStepModal');
        }
    };
}
