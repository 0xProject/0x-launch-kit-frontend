import * as _ from 'lodash';

import { STYLIZER_SOURCE_NAME } from '../constants';
import { DropshadowEffect, Effect, FigmaGlobalMetadata, FigmaColors, FigmaImage, FigmaObject, FigmaStylizedObject } from '../types';

import { convertDropShadowToBoxShadow, getHexString } from './css';

const SHADOW_KEY = 'DROP_SHADOW';

const getCardStyles = (stylizer: FigmaStylizedObject): object => {
    const rect = _.find(stylizer.children, (c: FigmaObject) => c.name === STYLIZER_SOURCE_NAME) as any as FigmaStylizedObject;
    const stroke = rect.strokes[0] as any as FigmaColors;
    const dropShadow = _.find(rect.effects, (e: Effect) => e.type === SHADOW_KEY) as any as Effect;
    let borderColor: string | null = null;
    if (!!stroke) {
        borderColor = getHexString(stroke.color);
    }
    let boxShadow: string | null = null;
    if (!!dropShadow) {
        boxShadow = convertDropShadowToBoxShadow(dropShadow as DropshadowEffect);
    }
    return {
        borderRadius: rect.cornerRadius,
        borderWidth: rect.strokeWeight,
        borderColor,
        boxShadow,
    };
};

const getTileStyles = (stylizer: FigmaStylizedObject, globalMetadata: FigmaGlobalMetadata): string => {
    const rect = _.find(stylizer.children, (c: FigmaObject) => c.name === STYLIZER_SOURCE_NAME) as any as FigmaStylizedObject;
    const fill = rect.fills[0] as any as FigmaImage;
    return globalMetadata.images[fill.imageRef];
};

const getFontStyles = (stylizer: FigmaStylizedObject): string => {
    const { fontFamily } = stylizer.style as any;
    return fontFamily;
};

export const getValueForTypeExt = (stylizer: FigmaStylizedObject, globalMetadata: FigmaGlobalMetadata, type: string): number | string | object | null => {
    switch (type) {
        case 'color':
            const fill = stylizer.fills[0] as any as FigmaColors;
            if (!!fill) {
                return getHexString(fill.color);
            }
            return null;
        case 'card': return getCardStyles(stylizer);
        case 'font': return getFontStyles(stylizer);
        case 'tile': return getTileStyles(stylizer, globalMetadata);
        default: return null;
    }
};
