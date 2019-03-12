import React from 'react';
import styled from 'styled-components';

import { MetamaskLarge } from '../icons/icon_metamask_large';
import { StepsProgress } from '../steps_modal/steps_progress';

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

const StepStatusConfirmOnMetamask = (props: React.Props<WithChildren>) => (
    <>
        <MetamaskIcon />
        {props.children}
    </>
);

const StepStatusLoading = (props: React.Props<WithChildren>) => <>{props.children}</>;

const StepStatusDone = (props: React.Props<WithChildren>) => <>{props.children}</>;

const StepStatusError = (props: React.Props<WithChildren>) => <>{props.children}</>;

const MetamaskIcon = styled(MetamaskLarge)`
    margin-bottom: 30px;
`;

const StepsTimeline = styled(StepsProgress)`
    margin-top: auto;
`;

const Title = styled.h1`
    color: #000;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    min-height: 300px;
    width: 310px;
`;

const ModalText = styled.p`
    color: #000;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0;
    padding: 0 20px;
    text-align: center;
`;

const ModalStatusText = styled.p`
    color: #666;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 20px 20px 0;
    text-align: center;
`;

export {
    DONE_STATUS_VISIBILITY_TIME,
    ModalContent,
    ModalStatusText,
    ModalText,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    StepsTimeline,
    Title,
};
