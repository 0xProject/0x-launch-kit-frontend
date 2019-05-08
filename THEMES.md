# Custom themes guide

## How to add new themes

By default the app uses a `WHITE THEME` and there is also available a `DARK THEME`.

If you want to customize the app with a custom theme you can add your own new theme and then apply it to the app.

### How to create a new theme

1. First of all you need to go to `/src/themes` and copy the `DefaultTheme` class and rename it with the name of your theme.

2. Change the signature of the class to `extends DefaultTheme`

3. Then you can replace both objects `modalThemeStyle` and `darkThemeColors` with the properties you want

4. Go to `/src/themes/theme_meta_data.tsx` and on the `KNOWN_THEMES_META_DATA` array, add a new object with a name and the instance of your class

5. Go to your `.env` file and change the value of `REACT_APP_THEME_NAME` to the name of your new theme

Note: you can use the `/src/themes/dark_theme.tsx` as an example.

#### Dark Theme example

dark_theme.ts:

```
const modalThemeStyle: ThemeModalStyle = {
    content: {
        ......
    },
    overlay: {
        ......
    },
};

const darkThemeColors: ThemeProperties = {
    background: '#000',
    borderColor: '#5A5A5A',
    boxShadow: '0 10px 10px rgba(0, 0, 0, 0.1)',
    buttonConvertBackgroundColor: '#343434',
    buttonConvertBorderColor: '#000',
    buttonConvertTextColor: '#fff',
    .......
};
export class DarkTheme extends DefaultTheme {
    constructor() {
        super();
        this.componentsTheme = darkThemeColors;
        this.modalTheme = modalThemeStyle;
    }
}
```

theme_mete_data.ts object:

```
export const KNOWN_THEMES_META_DATA: ThemeMetaData[] = [
    {
        name: 'DEFAULT_THEME',
        theme: new DefaultTheme(),
    },
    {
        name: 'DARK_THEME',
        theme: new DarkTheme(),
    },
];
```

.env file:

```
    ...
    REACT_APP_THEME_NAME='DARK_THEME'
```
