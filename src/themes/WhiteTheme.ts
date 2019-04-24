import { BasicTheme } from './BasicTheme';
import { ThemeColors } from './ThemeCommons';

const whiteThemeColors: ThemeColors = {
    background: '#f5f5f5',
    borderColor: '#DEDEDE',
    darkBlue: '#002979',
    darkGray: '#474747',
    darkerGray: '#666',
    errorButtonBackground: '#FF6534',
    errorCardBackground: '#FAF4EF',
    errorCardBorder: '#F39E4B',
    errorCardText: '#F68C24',
    gray: '#808080',
    green: '#3CB34F',
    lightGray: '#B9B9B9',
    orange: '#F6851B',
    rowActive: '#FBFDFF',
    textLight: '#999',
    notificationActive: '#F8F8F8',
};

export class WhiteTheme extends BasicTheme {
    constructor() {
        super(whiteThemeColors);
    }
}
