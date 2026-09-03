const convertRGBToHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  // eslint-disable-next-line no-bitwise
  const hex = ((r << 16) | (g << 8) | b).toString(16);
  return hex.padStart(6, '0');
};

export const convertRGBDecimalToHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  const hex = convertRGBToHex({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  });
  return hex;
};

export const convertStyleNameToKlear360Name = (styleName: string): string => {
  return styleName
    .split('/')
    .map((tokenPart) => tokenPart.charAt(0).toLocaleLowerCase() + tokenPart.slice(1))
    .join('.');
};

export const isBackgroundColorToken = (klear360Token: string): boolean => {
  return klear360Token.includes('surface.background');
};

export const isIconColorToken = (klear360Token: string): boolean => {
  return klear360Token.includes('action.icon') || klear360Token.includes('feedback.icon');
};
