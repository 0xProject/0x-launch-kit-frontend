import 'styled-components';

import { Theme } from './themes/commons';

declare module 'styled-components' {
    interface DefaultTheme extends Theme {}
}
