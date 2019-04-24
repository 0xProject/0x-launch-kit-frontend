import { BasicTheme } from './BasicTheme';
import { ThemeColors } from './ThemeCommons';

const darkThemeColors: ThemeColors = {
    background: 'black',
    borderColor: 'black',
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

export class DarkTheme extends BasicTheme {
    constructor() {
        super(darkThemeColors);
    }
}
