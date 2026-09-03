import overrideTheme from '../overrideTheme';
import { klear360Theme } from '../';
import type { ThemeTokens } from '../../theme';
import cloneDeep from '~utils/lodashButBetter/cloneDeep';

const invalidOverridesObjectError = '[Klear360: overrideTheme]: The overrides object is not valid';
const invalidBaseThemeError =
  '[Klear360: overrideTheme]: The base theme provided is not a valid Klear360 theme';

describe('overrideTheme', () => {
  it('should return new theme based on overrides for klear360Theme', () => {
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                intense: 'someothercolor',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(klear360Theme);
    overridenTheme.colors.onLight.surface.background.primary.intense =
      overrides.colors.onLight.surface.background.primary.intense;
    overridenTheme.colors.onLight.feedback.background.positive.intense =
      overrides.colors.onLight.feedback.background.positive.intense;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: klear360Theme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should return new theme based on overrides for bankingTheme', () => {
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                intense: 'someothercolor',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    const overridenTheme: ThemeTokens = cloneDeep(klear360Theme);
    overridenTheme.colors.onLight.surface.background.primary.intense =
      overrides.colors.onLight.surface.background.primary.intense;
    overridenTheme.colors.onLight.feedback.background.positive.intense =
      overrides.colors.onLight.feedback.background.positive.intense;

    const overrideThemeResult = overrideTheme({ baseThemeTokens: klear360Theme, overrides });
    expect(overrideThemeResult).toEqual(overridenTheme);
  });

  it('should throw error when overrides object is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const overrides = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                // this will fail test since empty values are not allowed
                intense: '',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        baseThemeTokens: klear360Theme,
        overrides,
      });
    }).toThrowError(invalidOverridesObjectError);
    mockConsoleError.mockRestore();
  });

  it('should throw error when base theme is invalid', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const invalidBaseTheme = {
      colors: {
        onLight: {
          surface: {
            background: {
              primary: {
                // this will fail test since empty values are not allowed
                intense: '',
              },
            },
          },
          feedback: {
            background: {
              positive: {
                intense: 'someothercolor',
              },
            },
          },
        },
      },
    };

    expect(() => {
      overrideTheme({
        // @ts-expect-error test the invalid base theme case
        baseThemeTokens: invalidBaseTheme,
        overrides: invalidBaseTheme,
      });
    }).toThrowError(invalidBaseThemeError);
    mockConsoleError.mockRestore();
  });
});
