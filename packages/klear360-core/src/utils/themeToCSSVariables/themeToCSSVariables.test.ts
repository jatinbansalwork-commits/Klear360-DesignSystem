import { describe, expect, it } from 'vitest';
import { klear360Theme } from '~tokens/theme';
import { themeToCSSVariables, cssVariablesToInlineStyle } from '~utils/themeToCSSVariables';

describe('themeToCSSVariables', () => {
  const resolvedTheme = {
    colors: klear360Theme.colors.onLight,
    elevation: klear360Theme.elevation.onLight,
    border: klear360Theme.border,
  };

  it('maps surface color tokens to theme.css variable names', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-background-gray-subtle']).toBe(
      klear360Theme.colors.onLight.surface.background.gray.subtle,
    );
    expect(vars['--surface-background-primary-intense']).toBe(
      klear360Theme.colors.onLight.surface.background.primary.intense,
    );
    expect(vars['--interactive-background-primary-default']).toBe(
      klear360Theme.colors.onLight.interactive.background.primary.default,
    );
  });

  it('normalizes onSea.onSubtle to --surface-text-on-sea-subtle', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--surface-text-on-sea-subtle']).toBe(
      klear360Theme.colors.onLight.surface.text.onSea.onSubtle,
    );
    expect(vars['--surface-text-on-sea-on-subtle']).toBeUndefined();
  });

  it('maps elevation and border tokens with units', () => {
    const vars = themeToCSSVariables(resolvedTheme);

    expect(vars['--elevation-low-raised']).toBe(klear360Theme.elevation.onLight.lowRaised);
    expect(vars['--border-radius-medium']).toBe(`${klear360Theme.border.radius.medium}px`);
    expect(vars['--border-radius-round']).toBe(klear360Theme.border.radius.round);
    expect(vars['--border-width-thin']).toBe(`${klear360Theme.border.width.thin}px`);
  });

  it('maps resolved typography to theme.css font variables', () => {
    const vars = themeToCSSVariables({
      ...resolvedTheme,
      typography: klear360Theme.typography.onDesktop,
    });

    expect(vars['--font-family-text']).toBe(klear360Theme.typography.onDesktop.fonts.family.text);
    expect(vars['--font-size-200']).toBe(`${klear360Theme.typography.onDesktop.fonts.size[200]}px`);
    expect(vars['--letter-spacing-25']).toBe(
      `${klear360Theme.typography.onDesktop.letterSpacings[25]}%`,
    );
  });

  it('serializes variables to an inline style string', () => {
    const style = cssVariablesToInlineStyle({
      '--border-radius-medium': '16px',
      '--surface-background-primary-intense': 'hsla(160, 50%, 40%, 1)',
    });

    expect(style).toContain('--border-radius-medium:16px');
    expect(style).toContain('--surface-background-primary-intense:hsla(160, 50%, 40%, 1)');
  });
});
