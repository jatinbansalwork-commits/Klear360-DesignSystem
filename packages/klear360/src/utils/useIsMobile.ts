import { useBreakpoint } from './useBreakpoint';
import { useTheme } from '~components/Klear360Provider';

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

export { useIsMobile };
