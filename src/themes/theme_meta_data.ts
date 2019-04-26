import { BasicTheme } from './BasicTheme';
import { DarkTheme } from './DarkTheme';
import { ThemeMetaData } from './ThemeCommons';

export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'WHITE_THEME',
        theme: new BasicTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
];
