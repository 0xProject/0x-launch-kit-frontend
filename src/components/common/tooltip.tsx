import React, { HTMLAttributes } from 'react';
import styled, { keyframes } from 'styled-components';

import { InfoIcon } from './icons/info_icon';
import { InfoIconFull } from './icons/info_icon_full';

export enum TooltipPosition {
    Top = 1,
    Bottom = 2,
    Left = 3,
    Right = 4,
}

export enum IconType {
    Line = 1,
    Fill = 2,
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    description?: string;
    iconType?: IconType;
    tooltipPosition?: TooltipPosition;
    tabIndex?: number;
}

const TooltipPopup = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
    position: relative;

    &:focus {
        cursor: default;
        > div {
            display: block;
        }
    }
`;

const tooltipAnimation = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const TooltipContent = styled.div<{ position: TooltipPosition }>`
    animation-fill-mode: forwards;
    animation: ${tooltipAnimation} 0.15s linear 1;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 4px;
    border: none;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.09);
    color: #fff;
    display: none;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.2;
    min-width: 140px;
    padding: 8px 10px;
    position: absolute;

    ${props => (props.position === TooltipPosition.Bottom ? 'top: 20px;' : '')}
    ${props => (props.position === TooltipPosition.Top ? 'bottom: 20px;' : '')}
    ${props =>
        props.position === TooltipPosition.Right || props.position === TooltipPosition.Left
            ? 'top: 50%; transform: translateY(-50%);'
            : ''}
    ${props => (props.position === TooltipPosition.Right ? 'left: 20px;' : '')}
    ${props => (props.position === TooltipPosition.Left ? 'right: 20px;' : '')}
`;

export const Tooltip: React.FC<Props> = props => {
    const { iconType = IconType.Line, description, tooltipPosition, ...restProps } = props;
    const tooltipContent = description ? (
        <TooltipContent position={tooltipPosition ? tooltipPosition : TooltipPosition.Top}>
            {props.description}
        </TooltipContent>
    ) : null;
    const tooltipIcon = iconType === IconType.Fill ? <InfoIconFull /> : <InfoIcon />;

    return (
        <TooltipPopup tabIndex={-1} {...restProps}>
            {tooltipIcon}
            {tooltipContent}
        </TooltipPopup>
    );
};
