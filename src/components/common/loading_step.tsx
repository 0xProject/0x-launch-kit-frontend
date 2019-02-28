import React from 'react';
import { connect } from 'react-redux';

import { stepsModalAdvanceStep } from '../../store/actions';
import { getStepsModalCurrentStep, getStepsModalTransactionPromise } from '../../store/selectors';
import { StepLoading, StoreState } from '../../util/types';

interface StateProps {
    step: StepLoading;
    promise: Promise<any>;
}

interface DispatchProps {
    advanceStep: () => any;
}

type Props = StateProps & DispatchProps;

class LoadingStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { advanceStep, promise } = this.props;
        if (promise) {
            await promise;
            advanceStep();
        }
    };

    public render = () => {
        const { step } = this.props;
        return (
            <div>
                <p>{step.message}</p>
                <p>Loading</p>
            </div>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepLoading,
        promise: getStepsModalTransactionPromise(state) as Promise<any>,
    };
};

const LoadingStepContainer = connect(
    mapStateToProps,
    {
        advanceStep: stepsModalAdvanceStep,
    },
)(LoadingStep);

export { LoadingStep, LoadingStepContainer };
