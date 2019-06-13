import * as _ from 'lodash';

import { STYLIZER_SOURCE_NAME } from '../constants';
import { DropshadowEffect, Effect, FigmaColors, FigmaObject, FigmaStylizedObject } from '../types';

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

export const getValueForTypeExt = (stylizer: FigmaStylizedObject, type: string): number | string | object | null => {
    switch (type) {
        case 'color':
            const fill = stylizer.fills[0] as any as FigmaColors;
            if (!!fill) {
                return getHexString(fill.color);
            }
            return null;
        case 'card': return getCardStyles(stylizer);
        case 'font':
        default: return null;
    }
};
