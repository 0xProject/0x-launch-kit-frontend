# Custom themes guide

## How to add new themes

By default the app uses a `LIGHT THEME` and there is also available a `DARK THEME`.

If you want to customize the app with a custom theme you can add your own.

### How to create a new theme

Note: All the relevant files are in the `src/themes` folder.

For this example our new theme will be called `NEW THEME`.

1. Copy default_theme.ts to new_theme.ts
2. Change `export class DefaultTheme` to `export class NewTheme` in `new_theme.ts`
3. Add:
   `{ name: 'NEW_THEME', theme: new NewTheme(), },`
   in the `KNOWN_THEMES_META_DATA` array found in `themes/theme_meta_data.ts`

4. In your `.env` file change the value of `REACT_APP_THEME_NAME` from `DEFAULT_THEME` to `NEW_THEME`

#### Dark Theme example

dark_theme.ts:

```typescript
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

theme_meta_data.ts object:

```typescript
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
REACT_APP_ERC20_THEME_NAME = 'DARK_THEME'
REACT_APP_ERC721_THEME_NAME = 'LIGHT_THEME'

```

Note: you can configure the themes for the ERC20 and ERC721 app separately using those env vars.
