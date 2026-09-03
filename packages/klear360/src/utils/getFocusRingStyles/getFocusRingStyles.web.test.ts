import { klear360Theme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({
      theme: {
        ...klear360Theme,
        colors: klear360Theme.colors.onLight,
        elevation: klear360Theme.elevation.onLight,
        typography: klear360Theme.typography.onDesktop,
      },
    });
    expect(result).toMatchObject({
      outline: '4px solid hsla(198, 100%, 18%, 0.18)',
      outlineOffset: '1px',
      transitionDuration: '80ms',
      transitionProperty: 'outline-width',
      transitionTimingFunction: 'cubic-bezier(0.3, 0, 0.2, 1)',
    });
  });
});
