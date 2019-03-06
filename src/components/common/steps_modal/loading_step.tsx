import React from 'react';
import { connect } from 'react-redux';

import { stepsModalAdvanceStep } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepLoading, StoreState } from '../../../util/types';

interface StateProps {
    step: StepLoading;
}

interface DispatchProps {
    advanceStep: () => any;
}

type Props = StateProps & DispatchProps;

class LoadingStep extends React.Component<Props> {
    public shouldComponentUpdate = (nextProps: Props) => {
        const { step, advanceStep } = nextProps;
        if (!step.isLoading) {
            advanceStep();
        }
        return false;
    };

    public render = () => {
        const { step } = this.props;
        return (
            <div>
                <p>{step.message}</p>
            </div>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepLoading,
    };
};

const LoadingStepContainer = connect(
    mapStateToProps,
    {
        advanceStep: stepsModalAdvanceStep,
    },
)(LoadingStep);

export { LoadingStep, LoadingStepContainer };
