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
    sidebarWidth: '350px',
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
