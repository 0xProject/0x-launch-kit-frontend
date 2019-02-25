export const themeColors = {
    orange: '#F6851B',
    darkGray: '#474747',
    darkBlue: '#002979',
    green: '#3CB34F',
    lightGray: '#B9B9B9',
    textLight: '#999999',
    borderColor: '#DEDEDE',
};

export const themeDimensions = {
    borderRadius: '4px',
    fieldHeight: '46px',
    horizontalPadding: '20px',
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
