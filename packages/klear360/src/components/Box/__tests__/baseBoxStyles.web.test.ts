import {
  getBaseBoxStyles,
  getSpacingValue,
  shouldAddBreakpoint,
  getAllMediaQueries,
  getAllProps,
} from '../BaseBox/baseBoxStyles';
import { getResponsiveValue } from '../BaseBox/getResponsiveValue.web';
import type { BaseBoxProps } from '../BaseBox';
import { removeUndefinedValues } from './baseBoxStyles.test';
import klear360LightTheme from '~components/Klear360Provider/__tests__/klear360LightTheme/klear360LightTheme';
import type { Theme } from '~components/Klear360Provider';

describe('getResponsiveValue', () => {
  it('should return correctly for plain values', () => {
    expect(getResponsiveValue('hello', 'base')).toBe('hello');
    expect(getResponsiveValue('hello', 'xs')).toBe(undefined);
  });

  it('should correctly handle falsy values', () => {
    expect(getResponsiveValue(undefined, 'base')).toBe(undefined);
    // @ts-expect-error: intentional null to check the falsy values
    expect(getResponsiveValue(null, 'base')).toBe(undefined);
    expect(getResponsiveValue(0, 'base')).toBe(0);
    expect(getResponsiveValue('', 'base')).toBe('');
    expect(getResponsiveValue({ base: 3, s: 0 }, 's')).toBe(0);
  });

  it('should return the right responsive value for given size', () => {
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'm')).toBe('medium-value');
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 'base')).toBe(
      'base-value',
    );
    expect(getResponsiveValue({ base: 'base-value', m: 'medium-value' }, 's')).toBe(undefined);
  });
});

describe('shouldAddBreakpoint', () => {
  it('should return false if all values in props are undefined', () => {
    expect(shouldAddBreakpoint({ display: undefined, position: undefined })).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(shouldAddBreakpoint({})).toBe(false);
  });

  it('should return true if one of the value is defined', () => {
    expect(shouldAddBreakpoint({ display: '', position: undefined })).toBe(true);
  });
});

describe('getSpacingValue', () => {
  it('should return correct responsive spacing value', () => {
    expect(getSpacingValue('spacing.2', klear360LightTheme, 'base')).toBe('4px');
    expect(getSpacingValue('spacing.2', klear360LightTheme, 'm')).toBe(undefined);

    const responsiveSpacingProp: BaseBoxProps['padding'] = {
      base: 'spacing.10',
      xs: '12px',
      s: ['spacing.1', '12px', '100%', 'auto'],
    };
    expect(getSpacingValue(responsiveSpacingProp, klear360LightTheme, 'base')).toBe('48px');
    expect(getSpacingValue(responsiveSpacingProp, klear360LightTheme, 'xs')).toBe('12px');
    expect(getSpacingValue(responsiveSpacingProp, klear360LightTheme, 's')).toBe(
      '2px 12px 100% auto',
    );
  });
});

describe('getBaseBoxStyles', () => {
  it('should add given media queries', () => {
    const boxStyles = getBaseBoxStyles({
      margin: {
        base: 'spacing.1',
        s: ['spacing.1', '12px', '100%'],
        m: '22px',
        xl: 'auto',
      },
      theme: klear360LightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`
      {
        "@media screen and (min-width: 1200px)": {
          "margin": "auto",
        },
        "@media screen and (min-width: 480px)": {
          "margin": "2px 12px 100%",
        },
        "@media screen and (min-width: 768px)": {
          "margin": "22px",
        },
        "margin": "2px",
      }
    `);
  });
});

describe('getAllMediaQueries', () => {
  it('should return empty object', () => {
    expect(
      removeUndefinedValues(getAllMediaQueries({ display: 'block', theme: klear360LightTheme })),
    ).toMatchInlineSnapshot(`{}`);
  });

  it('should return the media queries', () => {
    expect(
      removeUndefinedValues(
        getAllMediaQueries({
          display: { base: 'block', m: 'none', xl: 'flex' },
          theme: klear360LightTheme,
        }),
      ),
    ).toMatchInlineSnapshot(`
      {
        "@media screen and (min-width: 1200px)": {
          "display": "flex",
        },
        "@media screen and (min-width: 768px)": {
          "display": "none",
        },
      }
    `);
  });
});

describe('getAllProps', () => {
  it('should return all values for given screen size', () => {
    const baseBoxProps: BaseBoxProps & { theme: Theme } = {
      display: 'block',
      padding: { base: 'spacing.1', l: '20px' },
      margin: { m: 'spacing.1' },
      theme: klear360LightTheme,
    };

    expect(removeUndefinedValues(getAllProps(baseBoxProps))).toMatchInlineSnapshot(`
      {
        "display": "block",
        "padding": "2px",
      }
    `);

    expect(removeUndefinedValues(getAllProps(baseBoxProps, 'm'))).toMatchInlineSnapshot(`
      {
        "margin": "2px",
      }
    `);

    expect(removeUndefinedValues(getAllProps(baseBoxProps, 'l'))).toMatchInlineSnapshot(`
      {
        "padding": "20px",
      }
    `);
  });
});
