import React from 'react';

interface Props {
    estimatedTimeMs: number;
    now: Date;
    startTime: Date;
}

export const PendingTime: React.FC<Props> = ({ estimatedTimeMs, now, startTime }) => {
    const estimatedSeconds = Math.round(estimatedTimeMs / 1000);
    const finishTime = new Date(startTime.valueOf() + estimatedTimeMs);

    const totalPendingSeconds = now < finishTime ? Math.round((finishTime.valueOf() - now.valueOf()) / 1000) : 0;

    const pendingMinutes = Math.floor(totalPendingSeconds / 60);
    const pendingSeconds = totalPendingSeconds % 60;

    const pendingMinutesStr = pendingMinutes < 10 ? `0${pendingMinutes}` : pendingMinutes.toString();
    const pendingSecondsStr = pendingSeconds < 10 ? `0${pendingSeconds}` : pendingSeconds.toString();

    return (
        <span>
            {pendingMinutesStr}:{pendingSecondsStr} (Est. {estimatedSeconds} seconds)
        </span>
    );
};
