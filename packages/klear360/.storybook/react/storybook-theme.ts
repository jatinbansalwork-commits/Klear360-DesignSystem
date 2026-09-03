export const surfaceTextNormal = 'hsla(217, 56%, 17%, 1)';
export const klear360Primary = 'hsla(198, 100%, 18%, 1)';
export const klear360TextFont =
  '"Inter", -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif';
export const klear360CodeFont =
  '"Roboto Mono", ui-monospace, SFMono-Regular, Monaco, Consolas, monospace';

export const themeConfig = {
  base: 'light' as const,

  colorPrimary: klear360Primary,
  colorSecondary: klear360Primary,

  // UI
  appBg: '#F1F4F8',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.02)',
  appBorderRadius: 4,

  // Typography
  fontBase: klear360TextFont,
  fontCode: klear360CodeFont,

  // Text colors
  textColor: surfaceTextNormal,
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: surfaceTextNormal,
  barSelectedColor: klear360Primary,
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: surfaceTextNormal,
  inputBorderRadius: 2,

  // hack for changing height width of brand image
  brandTitle: `
    <img
      width="90px"
      alt="Klear360 logo"
      src="https://raw.githubusercontent.com/klear/klear360/348012984e5039265ff8197e73c258ec00c7606e/branding/klear360-logo-name.min.svg"
    />
  `,
  brandUrl: 'https://github.com/klear/klear360',
};
