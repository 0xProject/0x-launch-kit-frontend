
import { Rgba, DropshadowEffect } from '../types';

const HEX_STR = 16;
const MAX_COLOR_VALUE = 255;

export const getHexString = (color: Rgba) => {
    return `#${convertToHex(color.r)}${convertToHex(color.g)}${convertToHex(color.b)}`;
};

export const convertToHex = (value: number): string => {
    const scaled = Math.round(value * MAX_COLOR_VALUE);
    const hexStr = scaled.toString(HEX_STR);
    return hexStr.length === 1 ? `0${hexStr}` : hexStr;
};

export const convertTo255 = (value: number): number => {
    return Math.round(value * MAX_COLOR_VALUE);
};

export const convertToRgba = (color: Rgba) => {
    return `rgba(${convertTo255(color.r)}, ${convertTo255(color.g)}, ${convertTo255(color.b)}, ${convertTo255(color.a)})`;
};

export const convertDropShadowToBoxShadow = (effect: DropshadowEffect): string => {
    return `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${convertToRgba(effect.color)}`;
};
