import { FigmaStylizedObject, FigmaFills } from '../types';

import { getHexString } from './color';

export const getValueForTypeExt = (stylizer: FigmaStylizedObject, type: string): number | string | null => {
    switch (type) {
        case 'color':
            const fill = stylizer.fills[0] as any as FigmaFills;
            if (!!fill) {
                return getHexString(fill.color);
            }
            return null;
        case 'borderRadius':
        case 'font':
        default: return null;
    }
};
