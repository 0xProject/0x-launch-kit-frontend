import React from 'react';
import styled from 'styled-components';

const DONE_STATUS_VISIBILITY_TIME: number = 4000;

enum StepStatus {
    ConfirmOnMetamask,
    Loading,
    Done,
    Error,
}

interface WithChildren {
    children: React.ReactNode;
}

const StepStatusConfirmOnMetamask = (props: React.Props<WithChildren>) => <>{props.children}</>;

const StepStatusLoading = (props: React.Props<WithChildren>) => <>{props.children}</>;

const StepStatusDone = (props: React.Props<WithChildren>) => <>{props.children}</>;

const StepStatusError = (props: React.Props<WithChildren>) => <>{props.children}</>;

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

export {
    DONE_STATUS_VISIBILITY_TIME,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusLoading,
    StepStatusDone,
    StepStatusError,
    Title,
};
