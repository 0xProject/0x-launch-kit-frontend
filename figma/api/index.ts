import axios from 'axios';

import { FIGMA_ACCESS_TOKEN_KEY, FIGMA_API_URL, FIGMAIFY_ERRORS } from '../constants';
import { FigmaResponse } from '../types';

export const fetchFileTreeAsync = async (fileKey: string): Promise<FigmaResponse> => {
    const accessToken = process.env[FIGMA_ACCESS_TOKEN_KEY];
    if (!!!accessToken) {
        throw new Error(FIGMAIFY_ERRORS.NO_PROVIDED_TOKEN);
    }
    const config = {
        headers: {'X-FIGMA-TOKEN': accessToken},
    };

    try {
        const response = await axios.get(FIGMA_API_URL + fileKey, config);
        return response.data;
    } catch (e) {
        throw new Error( FIGMAIFY_ERRORS.INVALID_FIGMA_API);
    }
};
