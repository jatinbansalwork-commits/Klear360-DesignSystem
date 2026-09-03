/// <reference types="vite/client" />

import { Theme } from '@klear/klear360/components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
