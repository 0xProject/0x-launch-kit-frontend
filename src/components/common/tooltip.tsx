import React, { HTMLAttributes } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { InfoIcon } from './icons/info_icon';
import { InfoIconFull } from './icons/info_icon_full';

export enum IconType {
    Line,
    Fill,
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    description?: string;
    iconType?: IconType;
}

const TooltipPopup = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
    position: relative;

    .reactTooltip {
        background-color: ${props => props.theme.componentsTheme.tooltipBackgroundColor};
        color: ${props => props.theme.componentsTheme.tooltipTextColor};
        max-width: 250px;
        opacity: 1;
        text-align: left;

        &.place-left:after {
            border-left-color: ${props => props.theme.componentsTheme.tooltipBackgroundColor};
        }

        &.place-right:after {
            border-right-color: ${props => props.theme.componentsTheme.tooltipBackgroundColor};
        }

        &.place-top:after {
            border-top-color: ${props => props.theme.componentsTheme.tooltipBackgroundColor};
        }

        &.place-bottom:after {
            border-bottom-color: ${props => props.theme.componentsTheme.tooltipBackgroundColor};
        }

        .multi-line {
            text-align: left;
        }
    }
`;

export const Tooltip: React.FC<Props> = props => {
    const { iconType = IconType.Line, description, ...restProps } = props;
    const tooltipIcon = iconType === IconType.Fill ? <InfoIconFull /> : <InfoIcon />;

    return (
        <TooltipPopup data-class="reactTooltip" data-tip={description} data-multiline={true} {...restProps}>
            {tooltipIcon}
            <ReactTooltip />
        </TooltipPopup>
    );
};
