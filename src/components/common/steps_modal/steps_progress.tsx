import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Interval } from '../interval';

export type GetProgress = (now: number) => number;

export interface StepItem {
    active: boolean;
    progress: number | GetProgress;
    title: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    steps: StepItem[];
}

const StepsProgressWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: auto;
    padding-top: 22px;
    width: 100%;
`;

const StartingDot = styled.div`
    background: #000;
    border-radius: 50%;
    flex-grow: 0;
    flex-shrink: 0;
    height: 12px;
    width: 12px;
`;

const Step = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
`;

const StepLineContainer = styled.div`
    flex-grow: 1;
    margin: 0 3px;
    position: relative;
`;

const StepTitle = styled.h4<{ active?: boolean }>`
    color: ${props => (props.active ? '#000' : '#e6e6e6')};
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    position: absolute;
    text-align: center;
    top: -25px;
    white-space: nowrap;
    width: 100%;
`;

const StepLine = styled.div`
    background: rgba(0, 0, 0, 0.1);
    height: 3px;
    margin: 0;
    position: relative;
`;

const StepLineProgress = styled.div<{ progress?: number }>`
    background: #000;
    height: 3px;
    left: 0;
    margin: 0;
    position: absolute;
    width: ${props => (props.progress ? `${props.progress}%` : '0')};
`;

const StepDot = styled.div<{ progress?: number }>`
    background: ${props => (props.progress && props.progress >= 100 ? '#000' : 'rgba(0, 0, 0, 0.1)')};
    border-radius: 50%;
    flex-shrink: 0;
    height: 16px;
    width: 16px;

    svg {
        left: 3px;
        position: relative;
        top: -2px;
    }
`;

const checkMark = () => {
    return (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1.6665 4.23416L3.94864 6.51339L8.44045 1.33331"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};

export const StepsProgress: React.FC<Props> = props => {
    const { steps, ...restProps } = props;

    return (
        <StepsProgressWrapper {...restProps}>
            <StartingDot />
            {steps.map((item, index) => {
                const { progress } = item;

                const getProgress = progress instanceof Function ? progress : (now: number) => progress;

                return (
                    <Step key={index}>
                        <Interval delay={250}>
                            {now => (
                                <>
                                    <StepLineContainer>
                                        <StepTitle active={item.active || getProgress(now.valueOf()) >= 100}>
                                            {item.title}
                                        </StepTitle>
                                        <StepLine>
                                            <StepLineProgress progress={getProgress(now.valueOf())} />
                                        </StepLine>
                                    </StepLineContainer>
                                    <StepDot progress={getProgress(now.valueOf())}>{checkMark()}</StepDot>
                                </>
                            )}
                        </Interval>
                    </Step>
                );
            })}
        </StepsProgressWrapper>
    );
};
