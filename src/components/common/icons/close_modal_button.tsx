import React, { HTMLAttributes } from 'react';
import styled from 'styled-components';

const CloseButton = styled.span`
    align-items: center;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 20px;
`;

const CloseButtonContainer = styled.div`
    align-items: center;
    display: flex;
    height: 20px;
    justify-content: flex-end;
    margin-right: -10px;
    margin-top: -10px;
`;

const CloseButtonSVG = () => {
    return (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.4501 10.449C10.7538 10.1453 10.7538 9.65282 10.4501 9.34909L6.60062 5.49996L10.45 1.65093C10.7537 1.3472 10.7537 0.854765 10.45 0.551038C10.1462 0.247311 9.65374 0.24731 9.34999 0.551038L5.50063 4.40006L1.65018 0.549939C1.34643 0.246212 0.853943 0.246212 0.55019 0.549939C0.246437 0.853667 0.246436 1.34611 0.55019 1.64983L4.40064 5.49996L0.550081 9.35019C0.246327 9.65392 0.246327 10.1464 0.550081 10.4501C0.853834 10.7538 1.34632 10.7538 1.65007 10.4501L5.50063 6.59985L9.3501 10.449C9.65385 10.7527 10.1463 10.7527 10.4501 10.449Z"
                fill="#C4C4C4"
            />
        </svg>
    );
};

interface Props extends HTMLAttributes<HTMLDivElement> {
    onClick?: any;
}

export const CloseModalButton: React.FC<Props> = props => {
    const { onClick, ...restProps } = props;

    return (
        <CloseButtonContainer {...restProps}>
            <CloseButton onClick={onClick}>
                <CloseButtonSVG />
            </CloseButton>
        </CloseButtonContainer>
    );
};
