import React from 'react';
import styled, { withTheme } from 'styled-components';
import { OrderSide, ChartDimensions, Cord } from './types';
import { Cross } from 'recharts';

const DEFAULT_CROSSHAIR_WELL_WIDTH_IN_PX = 200;

interface CrosshairProps {
    width?: number;
    cord: Cord;
    parentChartDimensions: ChartDimensions;
    accentColor: string;
    price: string;
    volume: string;
    cost: string;
    unit: string;
}

const setCoordinateWithMarginInDisplaySpace = (parentChartDimensions: ChartDimensions, cord: Cord): Cord => {
    return {
        x: cord.x + parentChartDimensions.margin.left,
        y:
            parentChartDimensions.height -
            parentChartDimensions.margin.top -
            parentChartDimensions.margin.bottom -
            cord.y,
    };
};

const CrosshairWell = styled.div<CrosshairProps>`
    background-color: ${props => props.theme.componentsTheme.simplifiedTextBoxColor};
    border-color: ${props => props.theme.componentsTheme.cardBorderColor};
    border-style: solid;
    border-radius: 3px;
    border-width: 1px;
    width: ${props => props.width || DEFAULT_CROSSHAIR_WELL_WIDTH_IN_PX}px;
    margin: 0 1rem;
    padding: 0.5rem 0.75rem;
    transform: translateX(${props => props.cord.x}px);
    position: absolute;
    left: 0;
    z-index: 1;
    top: ${props => props.cord.y}px;
`;

const CrosshairLine = styled.div<CrosshairProps>`
    width: 0;
    position: absolute;
    top: ${props => props.cord.y}px;
    bottom: ${props => props.parentChartDimensions.margin.bottom}px;
    left: 0;
    opacity: 1;
    transform: translateX(${props => props.cord.x}px);
    border-left-style: dashed;
    border-left-width: 1px;
    border-left-color: ${props => props.accentColor};
    &::after {
        content: '';
        height: 6px;
        width: 6px;
        border-radius: 3px;
        position: absolute;
        top: -3px;
        left: -3px;
        background-color: ${props => props.accentColor};
    }
`;

const CrosshairWellLabel = styled.p`
    margin: 0;
    font-size: 12px;
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const CrosshairWellTitle = styled.p<CrosshairProps>`
    margin: 0 0 0.5rem 0;
    font-size: 16px;
    color: ${props => props.accentColor};
`;

const CrosshairCardLabelRow = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const Crosshair = (props: CrosshairProps) => {
    const cord = setCoordinateWithMarginInDisplaySpace(props.parentChartDimensions, props.cord);
    const updatedProps = { ...props, ...{ cord } };
    return (
        <>
            <CrosshairLine {...updatedProps} />
            <CrosshairWell {...updatedProps}>
                <CrosshairWellTitle {...updatedProps}>
                    {props.price} ${props.unit}
                </CrosshairWellTitle>
                <CrosshairCardLabelRow>
                    <CrosshairWellLabel>Volume: {props.volume}</CrosshairWellLabel>
                    <CrosshairWellLabel>Cost: {props.cost}</CrosshairWellLabel>
                </CrosshairCardLabelRow>
            </CrosshairWell>
        </>
    );
};
