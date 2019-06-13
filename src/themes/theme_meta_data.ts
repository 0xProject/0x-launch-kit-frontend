import { ThemeMetaData } from './commons';
import { CustomTheme } from './custom_theme';
import { DarkTheme } from './dark_theme';
import { DefaultTheme } from './default_theme';

export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'LIGHT_THEME',
        theme: new DefaultTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
    {
        name: 'CUSTOM_THEME',
        theme: new CustomTheme(),
    },
];
