import type { CSSObject } from '~utils/cssObject';
import type { Theme } from '~components/Klear360Provider';
import { makeSize, makeSpace, castWebType, makeMotionTime } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { size } from '~tokens/global';

/**
 * The 12px (default) hit-target column between the two panes. `touch-action: none` stops a touch
 * drag from also scrolling the page - the same reason `BottomSheetGrabHandle` sets it.
 */
const getHandleContainerStyles = ({
  theme,
  handleWidth,
  isFocusVisible,
}: {
  theme: Theme;
  handleWidth: number;
  isFocusVisible: boolean;
}): CSSObject => ({
  position: 'relative',
  flexShrink: 0,
  width: makeSize(handleWidth),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'col-resize',
  touchAction: 'none',
  userSelect: 'none',
  outline: 'none',
  ...(isFocusVisible ? getFocusRingStyles({ theme }) : undefined),
});

/**
 * The 1px (2px on hover/focus/dragging) vertical track line, centered in the handle column.
 */
const getHandleTrackStyles = ({
  theme,
  isDragging,
}: {
  theme: Theme;
  isDragging: boolean;
}): CSSObject => ({
  position: 'absolute',
  insetBlock: 0,
  left: '50%',
  width: isDragging ? '2px' : '1px',
  transform: 'translateX(-50%)',
  backgroundColor: isDragging
    ? theme.colors.interactive.background.primary.default
    : theme.colors.interactive.background.gray.faded,
  transitionProperty: 'width, background-color',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
});

/**
 * The small rounded-square grip containing the drag-handle (6-dot) icon, centered in the track.
 */
const getHandleGripStyles = ({
  theme,
  isDragging,
}: {
  theme: Theme;
  isDragging: boolean;
}): CSSObject => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: makeSize(size[20]),
  height: makeSize(size[32]),
  borderRadius: makeSpace(theme.border.radius.xsmall),
  borderWidth: makeSize(theme.border.width.thin),
  borderStyle: 'solid',
  borderColor: isDragging ? theme.colors.interactive.border.primary.default : 'transparent',
  backgroundColor: isDragging
    ? theme.colors.interactive.background.primary.default
    : theme.colors.interactive.background.gray.faded,
  transitionProperty: 'background-color, border-color',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
});

export { getHandleContainerStyles, getHandleTrackStyles, getHandleGripStyles };
