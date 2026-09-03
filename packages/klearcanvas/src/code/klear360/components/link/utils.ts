import { convertFigmaIconNameToKlear360IconName, isIconInstance } from '../../utils/iconUtils';
import { findNode } from '../../utils/findNode';
import type { Klear360ComponentInstanceNode } from '~/code/types/Klear360';

export const getLinkIcon = (
  klear360Instance: Klear360ComponentInstanceNode,
  iconLayerName: 'Icon Left' | 'Icon Right',
): string => {
  let icon = '';
  let iconLeftNode = findNode(
    klear360Instance,
    (klear360Node) => klear360Node.layerName === iconLayerName,
  );

  if (iconLeftNode !== null) {
    iconLeftNode = findNode(
      iconLeftNode,
      (klear360Node) => klear360Node.layerName === 'Icon (change here)',
    );
    if (isIconInstance(iconLeftNode as Klear360ComponentInstanceNode)) {
      icon = convertFigmaIconNameToKlear360IconName(
        (iconLeftNode as Klear360ComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  return icon;
};

export const getLinkIconProps = (
  klear360Instance: Klear360ComponentInstanceNode,
): { icon: string; iconPosition: '' | 'left' | 'right' } => {
  const leftIcon = getLinkIcon(klear360Instance, 'Icon Left');
  if (leftIcon) {
    return { icon: leftIcon, iconPosition: 'left' };
  }

  const rightIcon = getLinkIcon(klear360Instance, 'Icon Right');
  if (rightIcon) {
    return { icon: rightIcon, iconPosition: 'right' };
  }

  return { icon: '', iconPosition: '' };
};
