import { BasicTheme } from './BasicTheme';
import { BasicThemeModal } from './modal/BasicThemeModal';

export const themeDimensions = {
    borderRadius: '4px',
    fieldHeight: '46px',
    horizontalPadding: '16px',
    sidebarWidth: '350px',
    verticalPadding: '10px',
    verticalSeparation: '30px',
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

export interface ThemeColors {
    background: string;
    borderColor: string;
    darkBlue: string;
    darkGray: string;
    darkerGray: string;
    errorButtonBackground: string;
    errorCardBackground: string;
    errorCardBorder: string;
    errorCardText: string;
    gray: string;
    green: string;
    lightGray: string;
    orange: string;
    rowActive: string;
    textLight: string;
    notificationActive: string;
}

export interface ThemeModalStyle {
    content: {
        bottom: string;
        borderColor: string;
        flexGrow: string;
        left: string;
        minWidth: string;
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
    theme: BasicTheme;
}

export interface ThemeModalMetaData {
    name: string;
    theme: BasicThemeModal;
}

export enum TemplateType {
    ThemeTemplate = 'ThemeTemplate',
    ThemeModal = 'ThemeModal',
}
