import { DarkTheme } from './dark_theme';
import { DefaultTheme } from './default_theme';
import { ThemeMetaData } from './theme_commons';

export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'WHITE_THEME',
        theme: new DefaultTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
];
