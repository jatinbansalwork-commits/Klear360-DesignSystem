// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './avatar.module.css';

export {
  avatarWrapperStyles,
  getAvatarWrapperClasses,
  avatarButtonStyles,
  getAvatarButtonClasses,
  getAvatarGroupOverflowButtonClasses,
  avatarGroupOverflowTextColorToken,
  avatarGroupOverflowTextSizeMapping,
  getAvatarGroupOverflowBodyTextSize,
  avatarGroupStyles,
  getAvatarGroupClasses,
  avatarIconSizeTokens,
  avatarTextSizeMapping,
  avatarToBottomAddonSize,
  avatarToIndicatorSize,
  getAvatarTemplateClasses,
  getTopAddonClass,
  getBottomAddonClass,
} from './avatar';
/** @typedef {import('./avatar').AvatarWrapperVariants} AvatarWrapperVariants */
/** @typedef {import('./avatar').AvatarButtonVariants} AvatarButtonVariants */
/** @typedef {import('./avatar').AvatarGroupVariants} AvatarGroupVariants */
/** @typedef {import('./avatar').AvatarDensity} AvatarDensity */
/** @typedef {import('./slots').AvatarSlot} AvatarSlot */
