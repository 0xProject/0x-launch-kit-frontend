import { DarkTheme } from './DarkTheme';
import { WhiteModalTheme } from './modal/WhiteModalTheme';
import { ThemeMetaData, ThemeModalMetaData } from './ThemeCommons';
import { WhiteTheme } from './WhiteTheme';

export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'WHITE_THEME',
        theme: new WhiteTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
];

export const KNOWN_MODAL_THEMES_META_DATA: ThemeModalMetaData[] = [
    {
        name: 'WHITE_THEME',
        theme: new WhiteModalTheme(),
    },
];
