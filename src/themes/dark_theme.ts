import { ThemeProperties } from './commons';
import { DefaultTheme } from './default_theme';

const darkThemeColors: ThemeProperties = {
    background: '#000',
    borderColor: '#5A5A5A',
    buttonErrorBackgroundColor: '#FF6534',
    buttonPrimaryBackgroundColor: '#002979',
    buttonSecondaryBackgroundColor: '#3CB34F',
    buttonTertiaryBackgroundColor: '#F6851B',
    cardBackgroundColor: '#202123',
    cardBorderColor: '#000',
    cardTitleColor: '#fff',
    darkBlue: '#002979',
    darkGray: '#474747',
    darkerGray: '#666',
    errorButtonBackground: '#FF6534',
    errorCardBackground: '#FAF4EF',
    errorCardBorder: '#F39E4B',
    errorCardText: '#F68C24',
    gray: '#808080',
    green: '#3CB34F',
    inactiveTabBackgroundColor: '#1B1B1B',
    lightGray: '#B9B9B9',
    notificationActive: '#F8F8F8',
    orange: '#F6851B',
    rowActive: '#FBFDFF',
    textColorCommon: '#fff',
    textLight: '#999',
};

export class DarkTheme extends DefaultTheme {
    constructor() {
        super();
        this.componentsTheme = darkThemeColors;
    }
}
