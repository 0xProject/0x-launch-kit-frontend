import { BasicTheme } from '../themes/BasicTheme';
import { KNOWN_THEMES_META_DATA } from '../themes/theme_meta_data';

import { getLogger } from './logger';

const logger = getLogger('Themes::template_meta_data.ts');

export const getThemeByName = (templateName: string): any => {
    const themeDataFetched = KNOWN_THEMES_META_DATA.find(themeMetaData => themeMetaData.name === templateName);
    let templateReturn = null;
    if (!themeDataFetched) {
        logger.error(`Theme with name ${templateName} not found`);
        templateReturn = new BasicTheme();
    } else {
        templateReturn = themeDataFetched.theme;
    }
    return templateReturn;
};
