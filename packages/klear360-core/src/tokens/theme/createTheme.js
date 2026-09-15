import tinycolor from 'tinycolor2';
import { colors as globalColors, opacity } from '~tokens/global';
import { throwKlear360Error } from '~utils/logger';
import merge from '~utils/lodashButBetter/merge';
import klear360Theme from './klear360Theme';
import overrideTheme from './overrideTheme';
import { buildFontFaceCss } from '~utils/buildFontFaceCss';
import { buildSurfaceColorOverrides, buildTypographyOverrides } from './createThemeOverrides';

export * from './createThemeConfig';

// WCAG2ContrastOptions are the options used to determine if a color is readable
/** @type {import('tinycolor2').WCAG2Options} */
const WCAG2ContrastOptions = {
  level: 'AAA',
  size: 'large',
};

/**
 * getColorWithOpacity
 * @param {import('tinycolor2').ColorInput} color - The color to add opacity to
 * @param {number} opacity - The opacity to add to the color
 * @returns {string} The color with the opacity added
 * @example
 * getColorWithOpacity('#fff', 0.5) // returns 'hsla(0, 0%, 100%, 0.5)'
 *
 **/
const getColorWithOpacity = (color, opacity) => {
  return tinycolor(color).setAlpha(opacity).toHslString();
};

/**
 *
 * @description
 * Generates a chromatic color palette based on the base color passed in.
 * The base color is used to generate a palette of 11 colors, 5 shades lighter and 5 shades darker than the base color.
 * @param {import('tinycolor2').ColorInput} baseColorInput - The base color to generate the chromatic color palette from in hex, rgb, or hsl format
 * @returns {import('~tokens/global/colors').ColorChromaticScale} Array of chromatic color palette
 */
const generateChromaticBrandColors = (baseColorInput) => {
  const baseColor = tinycolor(baseColorInput);
  const baseColorHslString = baseColor.toHslString();
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    if (!baseColor.isValid()) {
      throwKlear360Error({
        message: 'Invalid brandColor passed',
        moduleName: 'createTheme',
      });
    }
  }

  const palette = [baseColorHslString]; // Include the original color
  const brightness = tinycolor(baseColor).getBrightness();
  // Determine how much to lighten or darken the colors depending on the brightness of the base color
  const lightnessFactor = brightness > 150 ? 3 : 6;
  const darknessFactor = brightness < 50 ? 3 : 5;

  let currentColor = baseColor;

  // Generate shades lighter
  for (let lightShadeIndex = 0; lightShadeIndex < 6; lightShadeIndex++) {
    currentColor = currentColor.brighten(lightnessFactor);
    palette.push(currentColor.toHslString());
  }

  currentColor = tinycolor(baseColorHslString); // Reset to the base color

  // Generate shades darker
  for (let darkShadeIndex = 0; darkShadeIndex < 4; darkShadeIndex++) {
    currentColor = currentColor.darken(darknessFactor);
    palette.unshift(currentColor.toHslString()); // Add shades at the beginning of the palette
  }

  const colorPalette = palette.reverse();
  const brandPrimaryColor = colorPalette[6];

  /** @type {import('~tokens/global/colors').ColorChromaticScale} */
  const brandColors = {
    50: colorPalette[0],
    100: colorPalette[1],
    200: colorPalette[2],
    300: colorPalette[3],
    400: colorPalette[4],
    500: colorPalette[5],
    600: brandPrimaryColor,
    700: colorPalette[7],
    800: colorPalette[8],
    900: colorPalette[9],
    1000: colorPalette[10],
    a50: getColorWithOpacity(brandPrimaryColor, opacity[100]),
    a150: getColorWithOpacity(brandPrimaryColor, opacity[100]),
    a100: getColorWithOpacity(brandPrimaryColor, opacity[200]),
    a200: getColorWithOpacity(brandPrimaryColor, opacity[300]),
    a400: getColorWithOpacity(brandPrimaryColor, opacity[400]),
  };

  return brandColors;
};

/**
 *
 * @param {import('~tokens/global/colors').ColorChromaticScale} brandColors - The brand colors to use to override the light theme
 * @description Returns overrides for the light theme with the brand colors passed in
 * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']>} Overrides for the light theme with the custom brand colors
 */
const getOnLightOverrides = (brandColors) => {
  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or dark color depending on which is more readable on top of that surface color
  const foregroundOnSurface = tinycolor.isReadable(
    globalColors.neutral.blueGrayLight[50],
    brandColors[600],
    WCAG2ContrastOptions,
  )
    ? brandColors[600]
    : globalColors.neutral.blueGrayLight[1100];

  const foregroundOnBrand = tinycolor
    .mostReadable(
      brandColors[900],
      [globalColors.neutral.white[500], globalColors.neutral.black[500]],
      WCAG2ContrastOptions,
    )
    .toHslString();

  // Overrides for the light theme with the brand colors passed in
  /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']>} */
  const lightThemeOverrides = {
    interactive: {
      background: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
          fadedHighlighted: brandColors.a150,
        },
      },
      border: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
        },
      },
      text: {
        primary: {
          normal: foregroundOnSurface,
          disabled: brandColors.a200,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
      icon: {
        primary: {
          normal: foregroundOnSurface,
          disabled: brandColors.a200,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
    },
    surface: {
      background: {
        primary: {
          intense: brandColors[600],
          subtle: brandColors.a150,
        },
      },
      border: {
        primary: {
          normal: brandColors[600],
          muted: brandColors.a200,
        },
      },
      icon: {
        primary: {
          normal: brandColors[600],
        },
      },
      text: {
        primary: {
          normal: brandColors[600],
        },
      },
    },
  };

  return lightThemeOverrides;
};

/**
 *
 * @param {import('~tokens/global/colors').ColorChromaticScale} brandColors - The brand colors to use to override the dark theme
 * @description Returns overrides for the dark theme with the brand colors passed in
 * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onDark']>} Overrides for the dark theme with the custom brand colors
 */
const getOnDarkOverrides = (brandColors) => {
  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or dark color depending on which is more readable on top of that surface color
  const foregroundOnSurface = tinycolor.isReadable(
    globalColors.neutral.blueGrayDark[1100],
    brandColors[400],
    WCAG2ContrastOptions,
  )
    ? brandColors[400]
    : globalColors.neutral.blueGrayDark[0];

  const foregroundOnBrand = tinycolor
    .mostReadable(
      brandColors[900],
      [globalColors.neutral.white[500], globalColors.neutral.black[500]],
      WCAG2ContrastOptions,
    )
    .toHslString();

  // Overrides for the dark theme with the brand colors passed in
  /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onDark']>} */
  const darkThemeOverrides = {
    interactive: {
      background: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
          fadedHighlighted: brandColors.a150,
        },
      },
      border: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
        },
      },
      text: {
        primary: {
          normal: foregroundOnSurface,
          disabled: brandColors.a400,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
      icon: {
        primary: {
          normal: foregroundOnSurface,
          disabled: brandColors.a400,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
    },
    surface: {
      background: {
        primary: {
          intense: brandColors[600],
          subtle: brandColors.a150,
        },
      },
      border: {
        primary: {
          normal: brandColors[600],
          muted: brandColors.a200,
        },
      },
      icon: {
        primary: {
          normal: brandColors[600],
        },
      },
    },
  };

  return darkThemeOverrides;
};

/**
 * @param {import('./createThemeConfig').CreateThemeConfig} themeConfig - Brand color and optional global theme overrides
 * @description
 * Creates Klear360 theme tokens from a brand color plus optional typography, surface, and radius overrides.
 * @returns {import('./createThemeConfig').CreateThemeResult}
 * @example
 * const { theme, brandColors, fontFaceCSS } = createTheme({
 *   brandColor: '#19BEA2',
 *   borderRadius: { medium: 16 },
 *   fontFamily: { text: 'CustomBrand, Inter, sans-serif' },
 *   fontFaces: [{ fontFamily: 'CustomBrand', src: '/fonts/custom.woff2', format: 'woff2' }],
 *   fontSizeScaleFactor: 1.05,
 *   surface: { background: { page: '#f5f5f5' } },
 * })
 **/
export const createTheme = ({
  brandColor,
  baseTheme,
  borderRadius,
  fontFamily,
  fontFaces,
  fontSizeOverrides,
  fontSizeScaleFactor,
  surface,
}) => {
  const chromaticBrandColors = generateChromaticBrandColors(brandColor);
  const brandedLightTheme = getOnLightOverrides(chromaticBrandColors);
  const brandedDarkTheme = getOnDarkOverrides(chromaticBrandColors);
  const surfaceColorOverrides = buildSurfaceColorOverrides(surface);
  const typographyOverrides = buildTypographyOverrides({
    fontFamily,
    fontSizeOverrides,
    fontSizeScaleFactor,
  });

  const brandedThemeTokens = overrideTheme({
    baseThemeTokens: baseTheme ?? klear360Theme,
    overrides: {
      name: `custom-${tinycolor(brandColor).toHex()}`,
      colors: {
        onLight: merge(
          /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']>} */ ({}),
          brandedLightTheme,
          surfaceColorOverrides?.onLight ?? {},
        ),
        onDark: merge(
          /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onDark']>} */ ({}),
          brandedDarkTheme,
          surfaceColorOverrides?.onDark ?? {},
        ),
      },
      ...(borderRadius
        ? {
            border: {
              radius: borderRadius,
            },
          }
        : {}),
      ...(typographyOverrides ? { typography: typographyOverrides } : {}),
    },
  });

  const fontFaceCSS = fontFaces && fontFaces.length > 0 ? buildFontFaceCss(fontFaces) : undefined;

  return { theme: brandedThemeTokens, brandColors: chromaticBrandColors, fontFaceCSS };
};
