import React from 'react';

import { PendingTime } from '../../common/pending_time';
import { Interval } from '../interval';

import { StepStatus } from './steps_common';

interface Props {
    estimatedTxTimeMs: number;
    stepStatus: StepStatus;
    txStarted: number | null;
}

export const StepPendingTime: React.FC<Props> = props => {
    const { estimatedTxTimeMs, stepStatus, txStarted } = props;

    if (stepStatus === StepStatus.Loading && txStarted) {
        const startTime = new Date(txStarted);
        return (
            <Interval delay={1000}>
                {now => <PendingTime now={now} startTime={startTime} estimatedTimeMs={estimatedTxTimeMs} />}
            </Interval>
        );
    }

    return null;
};
