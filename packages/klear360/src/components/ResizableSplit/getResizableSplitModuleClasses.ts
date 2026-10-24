import styles from './ResizableSplit.module.scss';

export const getResizableSplitClass = (): string => styles.split;

export const getResizableSplitPaneClass = (): string => styles.pane;

export const getResizableSplitHandleContainerClass = (): string => styles.handleContainer;

export const getResizableSplitHandleTrackClass = (): string => styles.track;

export const getResizableSplitHandleGripClass = (): string => styles.grip;

export const getResizableSplitHandleDataAttributes = ({
  isDragging,
  isFocusVisible,
}: {
  isDragging?: boolean;
  isFocusVisible?: boolean;
}): { 'data-dragging'?: true; 'data-focus-visible'?: true } => ({
  ...(isDragging ? { 'data-dragging': true } : {}),
  ...(isFocusVisible ? { 'data-focus-visible': true } : {}),
});
