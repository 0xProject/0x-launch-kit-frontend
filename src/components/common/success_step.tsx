import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep } from '../../store/selectors';
import { StepSuccess, StoreState } from '../../util/types';

interface OwnProps {
    onSuccess: () => any;
    visibleSeconds?: number;
}

interface StateProps {
    step: StepSuccess;
}

type Props = OwnProps & StateProps;

const DEFAULT_VISIBLE_SECONDS = 3;

class SuccessStep extends React.Component<Props> {
    public componentDidMount = async () => {
        const { visibleSeconds, onSuccess } = this.props;
        const seconds = visibleSeconds || DEFAULT_VISIBLE_SECONDS;
        setTimeout(() => onSuccess(), seconds * 1000);
    };

    public render = () => {
        return <p>Success</p>;
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepSuccess,
    };
};

const SuccessStepContainer = connect(mapStateToProps)(SuccessStep);

export { SuccessStep, SuccessStepContainer };
