import { ThemeModalStyle } from '../ThemeCommons';

import { BasicThemeModal } from './BasicThemeModal';

const whiteModalThemeColors: ThemeModalStyle = {
    content: {
        bottom: 'auto',
        borderColor: '#DEDEDE',
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

export class WhiteModalTheme extends BasicThemeModal {
    constructor() {
        super(whiteModalThemeColors);
    }
}
