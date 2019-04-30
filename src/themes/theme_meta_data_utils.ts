import { getLogger } from '../util/logger';

import { DefaultTheme } from './default_theme';
import { KNOWN_THEMES_META_DATA } from './theme_meta_data';

const logger = getLogger('Themes::theme_meta_data.ts');

export const getThemeByName = (themeName: string): any => {
    const themeDataFetched = KNOWN_THEMES_META_DATA.find(themeMetaData => themeMetaData.name === themeName);
    let themeReturn = null;
    if (!themeDataFetched) {
        logger.error(`Theme with name ${themeName} not found`);
        themeReturn = new DefaultTheme();
    } else {
        themeReturn = themeDataFetched.theme;
    }
    return themeReturn;
};
