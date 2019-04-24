import { ThemeColors } from './ThemeCommons';

export class BasicTheme implements ThemeColors {
    public background: string;
    public borderColor: string;
    public darkBlue: string;
    public darkGray: string;
    public darkerGray: string;
    public errorButtonBackground: string;
    public errorCardBackground: string;
    public errorCardBorder: string;
    public errorCardText: string;
    public gray: string;
    public green: string;
    public lightGray: string;
    public orange: string;
    public rowActive: string;
    public textLight: string;
    public notificationActive: string;
    constructor(themeColors: ThemeColors) {
        this.background = themeColors.background;
        this.borderColor = themeColors.borderColor;
        this.darkBlue = themeColors.darkBlue;
        this.darkGray = themeColors.darkerGray;
        this.darkerGray = themeColors.darkerGray;
        this.errorButtonBackground = themeColors.errorButtonBackground;
        this.errorCardBackground = themeColors.errorCardBackground;
        this.errorCardBorder = themeColors.errorCardBorder;
        this.errorCardText = themeColors.errorCardText;
        this.gray = themeColors.gray;
        this.green = themeColors.green;
        this.lightGray = themeColors.lightGray;
        this.orange = themeColors.orange;
        this.rowActive = themeColors.rowActive;
        this.textLight = themeColors.textLight;
        this.notificationActive = themeColors.notificationActive;
    }
}
