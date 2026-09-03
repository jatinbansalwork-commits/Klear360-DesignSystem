import type { Theme } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const klear360LightTheme: Theme = {
  name: 'klear360Theme',
  colors: klear360Theme.colors.onLight,
  border: klear360Theme.border,
  motion: klear360Theme.motion,
  spacing: klear360Theme.spacing,
  breakpoints: klear360Theme.breakpoints,
  elevation: klear360Theme.elevation.onLight,
  typography: klear360Theme.typography.onMobile,
  backdropBlur: klear360Theme.backdropBlur,
};

export default klear360LightTheme;
