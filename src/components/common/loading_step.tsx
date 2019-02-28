import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep, getStepsModalTransactionPromise } from '../../store/selectors';
import { StepLoading, StoreState } from '../../util/types';

interface OwnProps {
    onSuccess: () => any;
}

interface StateProps {
    step: StepLoading;
    promise: Promise<any>;
}

type Props = OwnProps & StateProps;

class LoadingStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { onSuccess, promise } = this.props;
        await promise;
        onSuccess();
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

const LoadingStepContainer = connect(mapStateToProps)(LoadingStep);

export { LoadingStep, LoadingStepContainer };
