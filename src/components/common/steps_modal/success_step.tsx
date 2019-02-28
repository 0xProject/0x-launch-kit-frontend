import React from 'react';
import { connect } from 'react-redux';

import { stepsModalAdvanceStep } from '../../../store/actions';
import { getStepsModalCurrentStep } from '../../../store/selectors';
import { StepSuccess, StoreState } from '../../../util/types';

interface StateProps {
    step: StepSuccess;
}

interface DispatchProps {
    advanceStep: () => any;
}

type Props = StateProps & DispatchProps;

class SuccessStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { step, advanceStep } = this.props;
        const seconds = step.visibleSeconds;
        if (seconds) {
            setTimeout(() => advanceStep(), seconds * 1000);
        }
    };

    public render = () => {
        return <p>Success!</p>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepSuccess,
    };
};

const SuccessStepContainer = connect(
    mapStateToProps,
    {
        advanceStep: stepsModalAdvanceStep,
    },
)(SuccessStep);

export { SuccessStep, SuccessStepContainer };
