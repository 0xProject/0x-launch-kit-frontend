
import { Rgba } from '../types';

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
