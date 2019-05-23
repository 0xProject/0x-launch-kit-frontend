import { ERC20_THEME_NAME, ERC721_APP_BASE_PATH, ERC721_THEME_NAME } from '../common/constants';
import { getLogger } from '../util/logger';
import { MARKETPLACES } from '../util/types';

import { Theme } from './commons';
import { DefaultTheme } from './default_theme';
import { KNOWN_THEMES_META_DATA } from './theme_meta_data';

const logger = getLogger('Themes::theme_meta_data.ts');

export const getThemeByName = (themeName: string): Theme => {
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

export const getThemeByRoute = (currentRoute: string): Theme => {
    if (currentRoute === ERC721_APP_BASE_PATH) {
        return getThemeByName(ERC721_THEME_NAME);
    } else {
        return getThemeByName(ERC20_THEME_NAME);
    }
};

export const getThemeByMarketplace = (marketplace: MARKETPLACES): Theme => {
    return marketplace === MARKETPLACES.ERC20 ? getThemeByName(ERC20_THEME_NAME) : getThemeByName(ERC721_THEME_NAME);
};
