import React from 'react';
import styled from 'styled-components';

import { SpinnerSize } from '../../../themes/commons';
import { MetamaskLarge } from '../icons/icon_metamask_large';
import { NotificationCancelIcon } from '../icons/notification_cancel_icon';
import { NotificationCheckmarkIcon } from '../icons/notification_checkmark_icon';
import { Spinner } from '../spinner';

import { StepsProgress } from './steps_progress';

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

const StepStatusLoading = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <Spinner size={SpinnerSize.Medium} />
        </IconContainer>
        {props.children}
    </>
);

const StepStatusDone = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <NotificationCheckmarkIcon />
        </IconContainer>
        {props.children}
    </>
);

const StepStatusError = (props: React.Props<WithChildren>) => (
    <>
        <IconContainer>
            <NotificationCancelIcon />
        </IconContainer>
        {props.children}
    </>
);

const iconMarginBottom = '30px';

const MetamaskIcon = styled(MetamaskLarge)`
    margin-bottom: ${iconMarginBottom};
`;

const StepsTimeline = styled(StepsProgress)`
    margin-top: auto;
`;

const Title = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
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
    flex-grow: 1;
    flex-shrink: 0;
    max-height: 100%;
    min-height: 300px;
    overflow: auto;
    width: 310px;
    height: 410px;
`;

const ModalText = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0;
    padding: 0 20px;
    text-align: center;
`;

const ModalTextClickable = styled.span`
    color: ${props => props.theme.componentsTheme.textLight};
    cursor: pointer;
    text-decoration: underline;
`;

const ModalStatusText = styled.p`
    color: ${props => props.theme.componentsTheme.textLighter};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    padding: 20px 20px 0;
    text-align: center;
`;

const ModalStatusTextLight = styled(ModalStatusText)`
    color: ${props => props.theme.componentsTheme.textLight};
    margin-bottom: 0px;
    padding: 0;
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 62px;
    justify-content: center;
    margin-bottom: ${iconMarginBottom};

    svg {
        height: 52px;
        width: 52px;
    }
    margin-top: auto;
`;

export {
    ModalContent,
    ModalStatusText,
    ModalStatusTextLight,
    ModalText,
    ModalTextClickable,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    StepsTimeline,
    Title,
};
