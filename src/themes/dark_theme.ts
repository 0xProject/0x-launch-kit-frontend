import { DefaultTheme } from './default_theme';
import { ThemeColors } from './theme_commons';

const darkThemeColors: ThemeColors = {
    background: 'black',
    borderColor: 'black',
    darkBlue: '#002979',
    darkGray: '#474747',
    darkerGray: '#666',
    errorButtonBackground: 'red', // was #FF6534, changed for example test
    errorCardBackground: '#FAF4EF',
    errorCardBorder: '#F39E4B',
    errorCardText: '#F68C24',
    gray: '#808080',
    green: 'yellow', // was #3CB34F, changed for example test
    lightGray: '#B9B9B9',
    orange: '#F6851B',
    rowActive: '#FBFDFF',
    textLight: 'blue', // was #999, changed for example test
    notificationActive: '#F8F8F8',
};

export class DarkTheme extends DefaultTheme {
    constructor() {
        super();
        this.componentsTheme = darkThemeColors;
    }
}
