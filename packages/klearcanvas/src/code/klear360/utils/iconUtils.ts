import { KLEAR360_ICONS } from '../constants/icons';
import type { Klear360ComponentInstanceNode } from '~/code/types/Klear360';

const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Convert icon names from figma to icon names used by Klear360 in code
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns converted name
 */
export const convertFigmaIconNameToKlear360IconName = (figmaName: string): string =>
  `${figmaName
    .split('-')
    .map(capitalizeFirstLetter)
    .reduce((acc, current) => acc + current, '')}Icon`;

/**
 * Check if an icon name is present in Figma
 * eg - alert-triangle -> AlertTriangleIcon
 * @param instanceName figma name of the icon
 * @returns whether name is a klear360 icon name
 */
export const isIconName = (instanceName: string): boolean => {
  const convertedName = convertFigmaIconNameToKlear360IconName(instanceName);

  return KLEAR360_ICONS.includes(convertedName);
};

export const isIconInstance = (klear360Node: Klear360ComponentInstanceNode): boolean => {
  const instanceName = klear360Node.name;
  if (!instanceName) {
    return false;
  }
  return isIconName(instanceName) && Object.keys(klear360Node.componentProperties).length === 0;
};
