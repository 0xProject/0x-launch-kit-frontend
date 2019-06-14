import * as _ from 'lodash';
import * as path from 'path';

import { FIGMA_TYPES, FIGMAIFY_ERRORS, FILE_PAGE_NAME, STLE_FRAME_NAME, STYLIZER_NAME,  VALID_STYLE_ATTRIBUTE_EXTS} from '../constants';
import { FigmaDocument, FigmaFrame, FigmaGlobalMetadata, FigmaGroup, FigmaObject, FigmaPage, FigmaStylizedObject, StyleMetadata } from '../types';

import { getValueForTypeExt } from './stylizer';

const FILE_IDENTIFIER = 'file';

export const getFileKeyFromFigmaUrl = (url: string) => {
    const splitUrlComponents = _.split(url, '/');
    const fileIdentifierIndex: number = _.findIndex(splitUrlComponents, (u: string) => u === FILE_IDENTIFIER);
    // FILE_IDENTIFIER must exist and not be the last part of the url
    if (fileIdentifierIndex === -1 && fileIdentifierIndex === splitUrlComponents.length - 1) {
        throw new Error(FIGMAIFY_ERRORS.INVALID_FIGMA_URL);
    }
    return splitUrlComponents[fileIdentifierIndex + 1];
};

export const getStyleGuideFrame = (document: FigmaDocument): FigmaFrame => {
    const page = _.find(document.children, (p: FigmaPage) => p.name === FILE_PAGE_NAME);
    if (!!page) {
        const frame = _.find(page.children, (f: FigmaFrame) => f.name === STLE_FRAME_NAME);
        if (!!frame) {
            return frame;
        } else {
            throw new Error(FIGMAIFY_ERRORS.INVALID_FIGMA_FORMAT);
        }
    } else {
        throw new Error(FIGMAIFY_ERRORS.INVALID_FIGMA_FORMAT);
    }
};

export const hasValidAttributeSuffix = (name: string): boolean => {
    return !_.reduce(VALID_STYLE_ATTRIBUTE_EXTS, (stillNotValid: boolean, ext: string) => {
        if (!stillNotValid) {
            return stillNotValid;
        } else {
            return !_.endsWith(name, ext);
        }
    }, true);
};

export const getStyleMetadata = (frame: FigmaFrame, globalMetadata: FigmaGlobalMetadata): StyleMetadata => {
    const validStyleGroups: FigmaGroup[] = _.filter(frame.children, (f: FigmaGroup) => f.type === FIGMA_TYPES.GROUP && hasValidAttributeSuffix(f.name));
    // tslint:disable-next-line: no-inferred-empty-object-type
    const styleMetadata: StyleMetadata = _.reduce(validStyleGroups, (a: StyleMetadata, g: FigmaGroup): StyleMetadata => {
        const newAcc = _.clone(a);
        const { name: key, ext } = path.parse(g.name);
        const stylizer = _.find(g.children, (o: FigmaObject) => o.name === STYLIZER_NAME) as any as (FigmaStylizedObject | undefined);
        const type = ext.slice(1);
        if (!!stylizer) {
            newAcc[key] = {
                type,
                value: getValueForTypeExt(stylizer, globalMetadata, type),
            };
        }
        return newAcc;
    }, {});
    return styleMetadata;
};
