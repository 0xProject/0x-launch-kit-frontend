export interface Theme {
    componentsTheme: ThemeProperties;
    modalTheme: ThemeModalStyle;
}

export interface ThemeProperties {
    background: string;
    backgroundERC721: string;
    borderColor: string;
    boxShadow: string;
    buttonBuyBackgroundColor: string;
    buttonCollectibleSellBackgroundColor: string;
    buttonConvertBackgroundColor: string;
    buttonConvertBorderColor: string;
    buttonConvertTextColor: string;
    buttonErrorBackgroundColor: string;
    buttonPrimaryBackgroundColor: string;
    buttonQuaternaryBackgroundColor: string;
    buttonSecondaryBackgroundColor: string;
    buttonSellBackgroundColor: string;
    buttonTertiaryBackgroundColor: string;
    buttonTextColor: string;
    cardImageBackgroundColor: string;
    cardBackgroundColor: string;
    cardBorderColor: string;
    cardTitleColor: string;
    cardTitleOwnerColor: string;
    chartColor: string;
    darkBlue: string;
    darkGray: string;
    darkerGray: string;
    dropdownBackgroundColor: string;
    dropdownBorderColor: string;
    dropdownTextColor: string;
    errorButtonBackground: string;
    errorCardBackground: string;
    errorCardBorder: string;
    errorCardText: string;
    ethBoxActiveColor: string;
    ethBoxBorderColor: string;
    ethSetMinEthButtonBorderColor: string;
    ethSliderThumbBorderColor: string;
    ethSliderThumbColor: string;
    gray: string;
    green: string;
    iconLockedColor: string;
    iconUnlockedColor: string;
    inactiveTabBackgroundColor: string;
    lightGray: string;
    logoERC20Color: string;
    logoERC20TextColor: string;
    logoERC721Color: string;
    logoERC721TextColor: string;
    marketsSearchFieldBackgroundColor: string;
    marketsSearchFieldBorderColor: string;
    marketsSearchFieldTextColor: string;
    modalSearchFieldBackgroundColor: string;
    modalSearchFieldBorderColor: string;
    modalSearchFieldPlaceholderColor: string;
    modalSearchFieldTextColor: string;
    myWalletLinkColor: string;
    notificationActive: string;
    notificationIconColor: string;
    notificationsBadgeColor: string;
    numberDecimalsColor: string;
    red: string;
    rowActive: string;
    rowOrderActive: string;
    simplifiedTextBoxColor: string;
    stepsProgressCheckMarkColor: string;
    stepsProgressStartingDotColor: string;
    stepsProgressStepLineColor: string;
    stepsProgressStepLineProgressColor: string;
    stepsProgressStepTitleColor: string;
    stepsProgressStepTitleColorActive: string;
    tableBorderColor: string;
    tdColor: string;
    textColorCommon: string;
    textDark: string;
    textInputBackgroundColor: string;
    textInputBorderColor: string;
    textInputTextColor: string;
    textLight: string;
    textLighter: string;
    thColor: string;
    tooltipBackgroundColor: string;
    tooltipTextColor: string;
    topbarBackgroundColor: string;
    topbarBorderColor: string;
    topbarSeparatorColor: string;
}

export interface ThemeModalStyle {
    content: {
        backgroundColor: string;
        borderColor: string;
        bottom: string;
        display: string;
        flexDirection: string;
        flexGrow: string;
        left: string;
        maxHeight: string;
        minWidth: string;
        overflow: string;
        padding: string;
        position: string;
        right: string;
        top: string;
    };
    overlay: {
        alignItems: string;
        backgroundColor: string;
        display: string;
        justifyContent: string;
        zIndex: string;
    };
}

export interface ThemeMetaData {
    name: string;
    theme: Theme;
}

export const themeDimensions = {
    borderRadius: '4px',
    fieldHeight: '46px',
    footerHeight: '38px',
    horizontalPadding: '16px',
    mainPadding: '10px',
    sidebarWidth: '350px',
    toolbarHeight: '64px',
    verticalPadding: '10px',
    verticalSeparation: '30px',
    verticalSeparationSm: '10px',
};

export const themeBreakPoints = {
    lg: '992px',
    md: '768px',
    sm: '480px',
    xl: '1024px',
    xs: '320px',
    xxl: '1280px',
    xxxl: '1366px',
};

export const themeFeatures = {
    boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
};

export enum SpinnerSize {
    Small = '26px',
    Medium = '52px',
}
