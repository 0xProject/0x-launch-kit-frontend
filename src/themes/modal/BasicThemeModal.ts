import { ThemeModalStyle } from '../ThemeCommons';

export class BasicThemeModal implements ThemeModalStyle {
    public content: {
        bottom: string;
        borderColor: string;
        flexGrow: string;
        left: string;
        minWidth: string;
        position: string;
        right: string;
        top: string;
    };
    public overlay: {
        alignItems: string;
        backgroundColor: string;
        display: string;
        justifyContent: string;
        zIndex: string;
    };
    constructor(themeModalStyle: ThemeModalStyle) {
        this.content = {
            ...themeModalStyle.content,
        };
        this.overlay = {
            ...themeModalStyle.overlay,
        };
    }
}
