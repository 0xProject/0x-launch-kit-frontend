export const themeColors = {
    borderColor: '#DEDEDE',
    darkBlue: '#002979',
    darkGray: '#474747',
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
};

export const themeDimensions = {
    borderRadius: '4px',
    fieldHeight: '46px',
    horizontalPadding: '16px',
    sidebarWidth: '350px',
    verticalPadding: '10px',
    verticalSeparation: '30px',
};

export const themeModalStyle = {
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
