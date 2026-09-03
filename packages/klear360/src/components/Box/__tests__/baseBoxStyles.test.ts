import {
  getSpacingValue,
  getColorValue,
  getBaseBoxStyles,
  getBorderRadiusValue,
} from '../BaseBox/baseBoxStyles';
import klear360LightTheme from '~components/Klear360Provider/__tests__/klear360LightTheme';
import { isReactNative } from '~utils';

export const removeUndefinedValues = (props: Record<string, unknown>): Record<string, unknown> =>
  JSON.parse(JSON.stringify(props));

describe('getColorValue', () => {
  it('should return correct background color value', () => {
    expect(
      getColorValue('interactive.background.primary.default', klear360LightTheme, 'base'),
    ).toMatchInlineSnapshot(`"hsla(198, 100%, 18%, 1)"`);
    expect(getColorValue('red', klear360LightTheme, 'base')).toBe('red');
    expect(getColorValue('red', klear360LightTheme, 'm')).toBe(undefined);
    expect(getColorValue({ base: 'red', s: '#f30' }, klear360LightTheme, 's')).toBe('#f30');
  });
});

describe('getBorderRadiusValue', () => {
  it('should return correct border-radius value', () => {
    const native = isReactNative();
    expect(getBorderRadiusValue('max', klear360LightTheme, 'base')).toBe(native ? 9999 : '9999px');
    expect(getBorderRadiusValue('small', klear360LightTheme, 'base')).toBe(native ? 8 : '8px');
    expect(getBorderRadiusValue(undefined, klear360LightTheme, 'm')).toBe(undefined);
    expect(getBorderRadiusValue({ base: 'medium', s: 'max' }, klear360LightTheme, 's')).toBe(
      native ? 9999 : '9999px',
    );
  });
});

describe('getSpacingValue', () => {
  it('handle tokens, absolute values, and auto', () => {
    expect(getSpacingValue('spacing.1', klear360LightTheme, 'base')).toBe('2px');
    expect(getSpacingValue('spacing.0', klear360LightTheme, 'base')).toBe('0px');
    expect(getSpacingValue('1234px', klear360LightTheme, 'base')).toBe('1234px');
    expect(getSpacingValue('auto', klear360LightTheme, 'base')).toBe('auto');
  });

  it('handle array shorthands', () => {
    expect(getSpacingValue(['spacing.1', '12px', 'auto', '100%'], klear360LightTheme, 'base')).toBe(
      '2px 12px auto 100%',
    );

    expect(getSpacingValue(['spacing.0', '100px'], klear360LightTheme, 'base')).toBe('0px 100px');
    expect(getSpacingValue(['spacing.0', '100px', 'spacing.1'], klear360LightTheme, 'base')).toBe(
      '0px 100px 2px',
    );
  });
});

describe('getBaseBoxStyles', () => {
  it('should add base css property', () => {
    const boxStyles = getBaseBoxStyles({ backgroundColor: 'red', theme: klear360LightTheme });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`
      {
        "backgroundColor": "red",
      }
    `);
  });

  it('should add no css', () => {
    const boxStyles = getBaseBoxStyles({
      theme: klear360LightTheme,
    });
    const boxStylesWithoutUndefined = JSON.parse(JSON.stringify(boxStyles));
    expect(boxStylesWithoutUndefined).toMatchInlineSnapshot(`{}`);
  });
});
