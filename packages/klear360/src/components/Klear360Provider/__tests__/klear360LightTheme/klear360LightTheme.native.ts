import { Easing } from 'react-native-reanimated';
import { klear360Theme } from '~tokens/theme';
import type { Theme } from '~components/Klear360Provider';

const klear360LightTheme: Theme = {
  name: 'klear360Theme',
  colors: klear360Theme.colors.onLight,
  border: klear360Theme.border,
  spacing: klear360Theme.spacing,
  breakpoints: klear360Theme.breakpoints,
  elevation: klear360Theme.elevation.onLight,
  typography: klear360Theme.typography.onMobile,
  backdropBlur: klear360Theme.backdropBlur,
  motion: {
    ...klear360Theme.motion,
    easing: {
      linear: Easing.bezier(0, 0, 0, 0),
      entrance: Easing.bezier(0, 0, 0.2, 1),
      exit: Easing.bezier(0.17, 0, 1, 1),
      standard: Easing.bezier(0.3, 0, 0.2, 1),
      emphasized: Easing.bezier(0.5, 0, 0, 1),
      overshoot: Easing.bezier(0.5, 0, 0.3, 1.5),
      shake: Easing.bezier(1, 0.5, 0, 0.5),
    },
  },
};

export default klear360LightTheme;
