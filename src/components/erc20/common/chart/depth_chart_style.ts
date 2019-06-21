import { Theme } from '../../../../themes/commons';
import { hexToRgba } from '../../../../util/color_utils';

import { OrderSide } from './types';

interface SVGStyle {
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    color?: string;
    fill?: string;
}

interface AxesStyle {
    style: {
        tick: SVGStyle;
        text: SVGStyle;
        line: SVGStyle;
    };
    tickSizeOuter: number;
    tickSizeInner: number;
    tickPadding: number;
    orientation?: string;
}

interface DepthChartStyle {
    areaSeries: SVGStyle;
    lineSeries: SVGStyle;
    axesLeft: AxesStyle;
    axesRight: AxesStyle;
    axesBottom: AxesStyle;
}

export const getDepthChartStyle = (theme: Theme, orderSide: OrderSide): DepthChartStyle => {
    const accentColor = orderSide === OrderSide.Ask ? theme.componentsTheme.red : theme.componentsTheme.green;
    const axesDefaultStyle: AxesStyle = {
        style: {
            tick: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.1 },
            text: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.5 },
            line: { stroke: theme.componentsTheme.textColorCommon, opacity: 0.1 },
        },
        tickSizeOuter: 0,
        tickSizeInner: 4,
        tickPadding: -32,
    };
    return {
        areaSeries: {
            color: hexToRgba(accentColor, 0),
            fill: hexToRgba(accentColor, 0.2),
        },
        lineSeries: {
            strokeWidth: 1,
            color: hexToRgba(accentColor, 1),
        },
        axesLeft: { ...axesDefaultStyle, ...{ orientation: 'left' } },
        axesRight: { ...axesDefaultStyle, ...{ orientation: 'right' } },
        axesBottom: { ...axesDefaultStyle, ...{ tickPadding: 8 } },
    };
};
