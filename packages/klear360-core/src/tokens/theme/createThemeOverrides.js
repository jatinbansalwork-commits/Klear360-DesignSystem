import { typography as defaultTypography } from '~tokens/global/typography';

/**
 * @type {Record<keyof import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride, [
 *   colorName: keyof NonNullable<import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']['surface']['background']>>,
 *   intensity: string,
 * ]>}
 */
const surfaceBackgroundOverrideMap = {
  page: ['gray', 'moderate'],
  graySubtle: ['gray', 'subtle'],
  grayIntense: ['gray', 'intense'],
  primarySubtle: ['primary', 'subtle'],
  primaryIntense: ['primary', 'intense'],
  seaSubtle: ['sea', 'subtle'],
  seaIntense: ['sea', 'intense'],
  cloudSubtle: ['cloud', 'subtle'],
  cloudIntense: ['cloud', 'intense'],
};

/**
 * @param {import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride} override
 * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']['surface']['background']>}
 */
const mapSurfaceBackgroundOverride = (override) => {
  /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']['surface']['background']>} */
  const background = {};

  for (const key of /** @type {(keyof import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride)[]} */ (Object.keys(
    override,
  ))) {
    const value = override[key];
    if (value !== undefined) {
      const [colorName, intensity] = surfaceBackgroundOverrideMap[key];
      background[colorName] = { ...background[colorName], [intensity]: value };
    }
  }

  return background;
};

/**
 * @param {import('./createThemeConfig').CreateThemeSurfaceOverride} [surface]
 * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']> | undefined}
 */
export const buildSurfaceColorOverrides = (surface) => {
  if (!surface) {
    return undefined;
  }

  /**
   * @param {import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride} [background]
   * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('./theme').ThemeTokens['colors']['onLight']> | undefined}
   */
  const buildMode = (background) => {
    if (!background || Object.keys(background).length === 0) {
      return undefined;
    }
    return {
      surface: {
        background: mapSurfaceBackgroundOverride(background),
      },
    };
  };

  /** @type {import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride} */
  const onLightBackground = {
    ...surface.background,
    ...surface.onLight?.background,
  };
  /** @type {import('./createThemeConfig').CreateThemeSurfaceBackgroundOverride} */
  const onDarkBackground = {
    ...surface.background,
    ...surface.onDark?.background,
  };

  const onLight = buildMode(onLightBackground);
  const onDark = buildMode(onDarkBackground);

  if (!onLight && !onDark) {
    return undefined;
  }

  return {
    ...(onLight ? { onLight } : {}),
    ...(onDark ? { onDark } : {}),
  };
};

/**
 * @param {import('~tokens/global/typography').FontSize} size
 * @param {number} factor
 * @returns {import('~tokens/global/typography').FontSize}
 */
const applyFontSizeScaleFactor = (size, factor) => {
  const next = { ...size };
  for (const key of /** @type {(keyof import('~tokens/global/typography').FontSize)[]} */ (
    /** @type {unknown} */ (Object.keys(next))
  )) {
    next[key] = Math.round(next[key] * factor);
  }
  return next;
};

/**
 * @param {number} factor
 * @returns {void}
 */
const validateFontSizeScaleFactor = (factor) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    if (!(factor > 0 && Number.isFinite(factor))) {
      throw new Error(
        `[Klear360: createTheme]: fontSizeScaleFactor must be a positive finite number but received ${factor}`,
      );
    }
  }
};

/**
 * @param {import('~tokens/global/typography').FontSize} size
 * @param {import('./createThemeConfig').CreateThemeFontSizeOverride} [scale]
 * @param {number} [factor]
 * @returns {import('~tokens/global/typography').FontSize}
 */
const mergeFontSizeScale = (size, scale, factor) => {
  let next = scale ? { ...size, ...scale } : { ...size };
  if (factor !== undefined && factor !== 1) {
    next = applyFontSizeScaleFactor(next, factor);
  }
  return next;
};

/**
 * @param {Object} params
 * @param {import('./createThemeConfig').CreateThemeFontFamilyOverride} [params.fontFamily]
 * @param {import('./createThemeConfig').CreateThemeFontSizeOverride} [params.fontSizeOverrides]
 * @param {number} [params.fontSizeScaleFactor]
 * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('~tokens/global/typography').TypographyWithPlatforms> | undefined}
 */
export const buildTypographyOverrides = ({
  fontFamily,
  fontSizeOverrides,
  fontSizeScaleFactor,
}) => {
  const hasFamily = fontFamily && Object.keys(fontFamily).length > 0;
  const hasSize =
    (fontSizeOverrides && Object.keys(fontSizeOverrides).length > 0) ||
    (fontSizeScaleFactor !== undefined && fontSizeScaleFactor !== 1);

  if (fontSizeScaleFactor !== undefined && fontSizeScaleFactor !== 1) {
    validateFontSizeScaleFactor(fontSizeScaleFactor);
  }

  if (!hasFamily && !hasSize) {
    return undefined;
  }

  /**
   * @param {import('~tokens/global/typography').Typography} platform
   * @returns {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('~tokens/global/typography').Typography>}
   */
  const patchPlatform = (platform) => {
    /** @type {import('~utils/isPartialMatchObjectKeys').DeepPartial<import('~tokens/global/typography').Typography['fonts']>} */
    const fonts = {};
    if (hasFamily) {
      fonts.family = { ...fontFamily };
    }
    if (hasSize) {
      fonts.size = mergeFontSizeScale(platform.fonts.size, fontSizeOverrides, fontSizeScaleFactor);
    }
    return { fonts };
  };

  return {
    onDesktop: patchPlatform(defaultTypography.onDesktop),
    onMobile: patchPlatform(defaultTypography.onMobile),
  };
};
