// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { fetchFileTreeAsync } from './api';
import { FIGMA_LAUNCH_KIT_URL_KEY } from './constants';
import { getFileKeyFromFigmaUrl, getStyleGuideFrame, getStyleMetadata } from './util/figma';

const writeFileAsync = util.promisify(fs.writeFile);

const FIGMA_URL = process.env[FIGMA_LAUNCH_KIT_URL_KEY] || '';
const STYLE_METADATA_FILENAME = 'custom_theme.json';
const STYLE_METADATA_OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'src', 'themes');

const updateStyleMetadata = async () => {
    const fileKey = getFileKeyFromFigmaUrl(FIGMA_URL);
    const response = await fetchFileTreeAsync(fileKey);
    const styleFrame = getStyleGuideFrame(response.document);
    const styleMetadata = getStyleMetadata(styleFrame);
    const filePath = path.resolve(STYLE_METADATA_OUTPUT_DIR, STYLE_METADATA_FILENAME);
    await writeFileAsync(filePath, JSON.stringify(styleMetadata));
};

// tslint:disable-next-line: no-floating-promises
updateStyleMetadata();
