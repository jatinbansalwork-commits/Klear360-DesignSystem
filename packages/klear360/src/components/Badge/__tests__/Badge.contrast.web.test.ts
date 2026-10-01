import tinycolor from 'tinycolor2';
import klear360Theme from '~tokens/theme/klear360Theme';
import klear360NeutralTheme from '~tokens/theme/klear360NeutralTheme';
import type { ThemeTokens } from '~tokens/theme';
import getIn from '~utils/lodashButBetter/get';

// WCAG 2.2 AA (SC 1.4.3) for normal-size text - Badge text is 12px.
const MIN_TEXT_CONTRAST = 4.5;

const BADGE_COLORS = [
  'positive',
  'negative',
  'notice',
  'information',
  'neutral',
  'primary',
] as const;
const EMPHASES = ['subtle', 'intense'] as const;
// Subtle feedback backgrounds are translucent, so the pair is checked over every page surface a
// Badge commonly sits on - the worst one has to pass.
const SURFACES = [
  'surface.background.gray.intense',
  'surface.background.gray.moderate',
  'surface.background.gray.subtle',
];

// Mirrors Badge's `getColorProps` token mapping.
const getBadgeTokenPair = (
  color: typeof BADGE_COLORS[number],
  emphasis: typeof EMPHASES[number],
): { text: string; background: string } => {
  if (color === 'primary') {
    return {
      text:
        emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.primary.normal',
      background: `surface.background.primary.${emphasis}`,
    };
  }
  return {
    text:
      emphasis === 'intense' ? 'surface.text.staticWhite.normal' : `feedback.text.${color}.intense`,
    background: `feedback.background.${color}.${emphasis}`,
  };
};

// Source-over alpha compositing of `foreground` onto an opaque `background`.
const composite = (foreground: string, background: tinycolor.Instance): tinycolor.Instance => {
  const fg = tinycolor(foreground).toRgb();
  const bg = background.toRgb();
  const mix = (channel: 'r' | 'g' | 'b'): number => fg[channel] * fg.a + bg[channel] * (1 - fg.a);
  return tinycolor({ r: mix('r'), g: mix('g'), b: mix('b') });
};

const getWorstContrast = ({
  colors,
  text,
  background,
}: {
  colors: Record<string, unknown>;
  text: string;
  background: string;
}): number =>
  Math.min(
    ...SURFACES.map((surface) => {
      const surfaceColor = composite(getIn(colors, surface), tinycolor('white'));
      const backgroundColor = composite(getIn(colors, background), surfaceColor);
      const textColor = composite(getIn(colors, text), backgroundColor);
      return tinycolor.readability(textColor, backgroundColor);
    }),
  );

describe('<Badge /> color contrast', () => {
  const cases = ([
    ['klear360Theme', klear360Theme],
    ['klear360NeutralTheme', klear360NeutralTheme],
  ] as [string, ThemeTokens][]).flatMap(([themeName, theme]) =>
    (['onLight', 'onDark'] as const).flatMap((colorScheme) =>
      BADGE_COLORS.flatMap((color) =>
        EMPHASES.map((emphasis) => ({ themeName, theme, colorScheme, color, emphasis })),
      ),
    ),
  );

  it.each(cases)(
    '$themeName $colorScheme: $color $emphasis badge text meets AA (>= 4.5:1)',
    ({ theme, colorScheme, color, emphasis }) => {
      const colors = (theme.colors[colorScheme] as unknown) as Record<string, unknown>;
      const contrast = getWorstContrast({ colors, ...getBadgeTokenPair(color, emphasis) });
      expect(contrast).toBeGreaterThanOrEqual(MIN_TEXT_CONTRAST);
    },
  );
});
