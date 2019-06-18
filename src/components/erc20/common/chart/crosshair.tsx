import React from 'react';
import styled from 'styled-components';

import { ChartDimensions, Cord } from './types';

const DEFAULT_CROSSHAIR_WELL_WIDTH_IN_PX = 200;
const DEFAULT_CROSSHAIR_WELL_HEIGHT_IN_PX = 74;
const DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX = 10;

interface ChartDimensionsWithWidth extends ChartDimensions {
    width: number;
}

interface CrosshairBounds {
    topLeft: Cord;
    bottomRight: Cord;
    calculateOffset: (cord: Cord) => Cord;
}

export interface CrosshairProps {
    width?: number;
    cord: Cord;
    parentChartDimensions: ChartDimensionsWithWidth;
    accentColor: string;
    price: number;
    volume: number;
    cost: number;
    quoteSymbol: string;
    baseSymbol: string;
}

interface CrosshairWellProps extends CrosshairProps {
    offset: Cord;
}

const generateCrosshairBounds = (width: number, dimension: ChartDimensionsWithWidth): CrosshairBounds[] => {
    const bottomBound = {
        topLeft: {
            x: 0,
            y:
                dimension.height -
                dimension.margin.bottom -
                DEFAULT_CROSSHAIR_WELL_HEIGHT_IN_PX -
                DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX,
        },
        bottomRight: {
            x: dimension.width,
            y: dimension.height,
        },
        calculateOffset: (cord: Cord) => {
            return {
                x: 0,
                y:
                    (cord.y +
                        DEFAULT_CROSSHAIR_WELL_HEIGHT_IN_PX -
                        (dimension.height - dimension.margin.bottom) +
                        DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX) *
                    -1,
            };
        },
    };

    const rightBound = {
        topLeft: {
            x: dimension.width - dimension.margin.right - width - DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX,
            y: 0,
        },
        bottomRight: {
            x: dimension.width,
            y: dimension.height,
        },
        calculateOffset: (cord: Cord) => {
            return {
                x: (width + DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX * 2) * -1,
                y: 0,
            };
        },
    };

    return [bottomBound, rightBound];
};

const applyBounds = (cord: Cord, bounds: CrosshairBounds[]): Cord => {
    return bounds.reduce(
        (a: Cord, c: CrosshairBounds) => {
            if (
                cord.x >= c.topLeft.x &&
                cord.x <= c.bottomRight.x &&
                cord.y >= c.topLeft.y &&
                cord.y <= c.bottomRight.y
            ) {
                const offset = c.calculateOffset(cord);
                return {
                    x: a.x + offset.x,
                    y: a.y + offset.y,
                };
            } else {
                return a;
            }
        },
        { x: DEFAULT_CROSSHAIR_WELL_MARGIN_IN_PX, y: 0 },
    );
};

const setCoordinateWithMarginInDisplaySpace = (parentChartDimensions: ChartDimensionsWithWidth, cord: Cord): Cord => {
    return {
        x: cord.x + parentChartDimensions.margin.left,
        y: parentChartDimensions.height - (parentChartDimensions.margin.bottom + cord.y),
    };
};

const CrosshairWell = styled.div<CrosshairWellProps>`
    background-color: ${props => props.theme.componentsTheme.simplifiedTextBoxColor};
    border-color: ${props => props.theme.componentsTheme.cardBorderColor};
    border-style: solid;
    border-radius: 3px;
    border-width: 1px;
    height: ${DEFAULT_CROSSHAIR_WELL_HEIGHT_IN_PX}px;
    width: ${props => props.width || DEFAULT_CROSSHAIR_WELL_WIDTH_IN_PX}px;
    padding: 0.5rem 0.75rem;
    transform: translateX(${props => props.cord.x}px);
    position: absolute;
    left: ${props => props.offset.x}px;
    z-index: 1;
    top: ${props => props.cord.y + props.offset.y}px;
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
        left: -3.5px;
        background-color: ${props => props.accentColor};
    }
`;

const CrosshairWellStatWrapper = styled.div``;

const CrosshairWellLabel = styled.p`
    margin: 0 0 0.2rem 0;
    font-size: 11px;
    color: ${props => props.theme.componentsTheme.textDark};
`;

const CrosshairWellStats = styled(CrosshairWellLabel)`
    margin: 0;
    font-size: 11px;
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const CrosshairWellTitle = styled.p<CrosshairProps>`
    margin: 0 0 0.6rem 0;
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
    const bounds = generateCrosshairBounds(
        props.width || DEFAULT_CROSSHAIR_WELL_WIDTH_IN_PX,
        props.parentChartDimensions,
    );
    const offset = applyBounds(cord, bounds);
    const quoteSymbol = props.quoteSymbol.slice(0).toUpperCase();
    const baseSymbol = props.baseSymbol.slice(0).toUpperCase();

    return (
        <>
            <CrosshairLine {...updatedProps} />
            <CrosshairWell {...updatedProps} offset={offset}>
                <CrosshairWellTitle {...updatedProps}>
                    {props.price.toString().slice(0, 12)} {quoteSymbol}
                </CrosshairWellTitle>
                <CrosshairCardLabelRow>
                    <CrosshairWellStatWrapper>
                        <CrosshairWellLabel>Volume:</CrosshairWellLabel>
                        <CrosshairWellStats>
                            {props.volume.toString().slice(0, 8)} {baseSymbol}
                        </CrosshairWellStats>
                    </CrosshairWellStatWrapper>
                    <CrosshairWellStatWrapper>
                        <CrosshairWellLabel>Cost:</CrosshairWellLabel>
                        <CrosshairWellStats>
                            {props.cost.toString().slice(0, 8)} {quoteSymbol}
                        </CrosshairWellStats>
                    </CrosshairWellStatWrapper>
                </CrosshairCardLabelRow>
            </CrosshairWell>
        </>
    );
};
