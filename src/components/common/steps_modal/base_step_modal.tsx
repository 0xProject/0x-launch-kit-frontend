import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getThemeColors } from '../../../store/selectors';
import { BasicTheme } from '../../../themes/BasicTheme';
import { getStepTitle, isLongStep, makeGetProgress } from '../../../util/steps';
import { Step, StoreState, StyledComponentThemeProps } from '../../../util/types';

import { StepPendingTime } from './step_pending_time';
import {
    ModalText,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    Title,
} from './steps_common';
import { GetProgress, StepItem, StepsProgress } from './steps_progress';

const ModalStatusTextLight = styled.span<StyledComponentThemeProps>`
    color: ${props => props.themeColors.textLight};
`;

const ModalTextClickable = styled.span<StyledComponentThemeProps>`
    color: ${props => props.themeColors.textLight};
    cursor: pointer;
    text-decoration: underline;
`;

export class BaseStepModalUnmountedException extends Error {
    constructor() {
        super('BaseStepModal unmounted');
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

type RunAction = ({
    onLoading,
    onDone,
    onError,
}: {
    onLoading: () => any;
    onDone: () => any;
    onError: (err: Error | BaseStepModalUnmountedException) => any;
}) => Promise<any>;

interface State {
    status: StepStatus;
    loadingStarted: number | null;
}

interface OwnProps {
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

interface StateProps {
    themeColorsConfig: BasicTheme;
}

type Props = StateProps & OwnProps;

class BaseStepModal extends React.Component<Props, State> {
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
        const { themeColorsConfig } = this.props;
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
                footer = (
                    <ModalStatusTextLight themeColors={themeColorsConfig}>{doneFooterCaption}</ModalStatusTextLight>
                );
                break;
            case StepStatus.Error:
                content = (
                    <StepStatusError>
                        <ModalText>
                            {errorCaption}{' '}
                            <ModalTextClickable onClick={retry} themeColors={themeColorsConfig}>
                                Click here to try again
                            </ModalTextClickable>
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
                footer = (
                    <ModalStatusTextLight themeColors={themeColorsConfig}>{loadingFooterCaption}</ModalStatusTextLight>
                );
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
        const onError = (err: Error | BaseStepModalUnmountedException) => {
            if (err instanceof BaseStepModalUnmountedException) {
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
            throw new BaseStepModalUnmountedException();
        }
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        themeColorsConfig: getThemeColors(state),
    };
};

const BaseStepModalContainer = connect(mapStateToProps)(BaseStepModal);

export { BaseStepModal, BaseStepModalContainer };
