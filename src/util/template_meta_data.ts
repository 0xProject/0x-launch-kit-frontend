import { BasicTheme } from '../themes/BasicTheme';
import { BasicThemeModal } from '../themes/modal/BasicThemeModal';
import { WhiteModalTheme } from '../themes/modal/WhiteModalTheme';
import { KNOWN_MODAL_THEMES_META_DATA, KNOWN_THEMES_META_DATA } from '../themes/theme_meta_data';
import { TemplateType } from '../themes/ThemeCommons';
import { WhiteTheme } from '../themes/WhiteTheme';

import { getLogger } from './logger';

const logger = getLogger('Themes::template_meta_data.ts');

export const getThemeTemplateInstanceByTemplateName = (templateName: string): BasicTheme => {
    return getTemplateInstanceByTemplateName(templateName, KNOWN_THEMES_META_DATA, TemplateType.ThemeTemplate);
};
export const getModalTemplateInstanceByTemplateName = (modalTemplateName: string): BasicThemeModal => {
    return getTemplateInstanceByTemplateName(modalTemplateName, KNOWN_MODAL_THEMES_META_DATA, TemplateType.ThemeModal);
};

const getTemplateInstanceByTemplateName = (
    templateName: string,
    templateMetaData: any[],
    templateType: TemplateType,
): any => {
    const themeDataFetched = templateMetaData.find(themeMetaData => themeMetaData.name === templateName);
    let templateReturn = null;
    if (!themeDataFetched) {
        logger.error(`Theme with name ${templateName} not found`);
        templateReturn = templateType === TemplateType.ThemeModal ? new WhiteModalTheme() : new WhiteTheme();
    } else {
        templateReturn = themeDataFetched.theme;
    }
    return templateReturn;
};
