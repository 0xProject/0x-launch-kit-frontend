import { Theme, themeColors, ThemeModalStyle, ThemeProperties } from './commons';

const modalThemeStyle: ThemeModalStyle = {
    content: {
        bottom: 'auto',
        borderColor: themeColors.borderColor,
        flexGrow: '0',
        left: 'auto',
        minWidth: '350px',
        position: 'relative',
        right: 'auto',
        top: 'auto',
    },
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: '12345',
    },
};

const whiteThemeColors: ThemeProperties = {
    background: '#f5f5f5',
    borderColor: '#DEDEDE',
    boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
    buttonConvertBackgroundColor: '#fff',
    buttonConvertBorderColor: '#DEDEDE',
    buttonConvertTextColor: '#474747',
    buttonErrorBackgroundColor: '#FF6534',
    buttonPrimaryBackgroundColor: '#002979',
    buttonSecondaryBackgroundColor: '#474747',
    buttonTertiaryBackgroundColor: '#F6851B',
    cardBackgroundColor: '#fff',
    cardBorderColor: '#DEDEDE',
    cardTitleColor: '#000',
    darkBlue: '#002979',
    darkGray: '#474747',
    darkerGray: '#666',
    dropdownBackgroundColor: '#fff',
    dropdownBorderColor: '#DEDEDE',
    dropdownTextColor: '#000',
    errorButtonBackground: '#FF6534',
    errorCardBackground: '#FAF4EF',
    errorCardBorder: '#F39E4B',
    errorCardText: '#F68C24',
    gray: '#808080',
    green: '#3CB34F',
    iconLockedColor: '#000',
    iconUnlockedColor: '#C4C4C4',
    inactiveTabBackgroundColor: '#f9f9f9',
    lightGray: '#B9B9B9',
    logoColor: '#0029FF',
    logoTextColor: '#000',
    marketsSearchFieldBackgroundColor: '#eaeaea',
    marketsSearchFieldBorderColor: '#DEDEDE',
    marketsSearchFieldTextColor: '#333',
    notificationActive: '#F8F8F8',
    notificationsBadgeColor: '#ff6534',
    numberDecimalsColor: '#DEDEDE',
    orange: '#F6851B',
    rowActive: '#FBFDFF',
    tableBorderColor: '#DEDEDE',
    tdColor: '#000',
    textColorCommon: '#000',
    textInputBackgroundColor: '#F9F9F9',
    textInputBorderColor: '#dedede',
    textInputTextColor: '#000',
    textLight: '#999',
    thColor: '#B9B9B9',
    topbarBackgroundColor: '#fff',
    topbarBorderColor: '#DEDEDE',
    topbarSeparatorColor: '#DEDEDE',
    notificationIconColor: '#474747',
};

export class DefaultTheme implements Theme {
    public componentsTheme: ThemeProperties;
    public modalTheme: ThemeModalStyle;
    constructor() {
        this.componentsTheme = whiteThemeColors;
        this.modalTheme = modalThemeStyle;
    }
}
