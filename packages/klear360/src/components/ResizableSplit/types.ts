import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ResizableSplitProps = {
  /**
   * Exactly two `ResizableSplitPane` children - the first is the "start" pane (flexes to fill
   * remaining space), the second is the "end" pane (the one `width` controls). Order matters:
   * it also determines which pane is the ARIA separator's "primary" pane for Home/End (see
   * `minStartWidth`).
   */
  children: React.ReactNode;
  /**
   * The end pane's current width in pixels, or `null` to use the responsive default (see
   * `computeDefaultWidth`). This component doesn't persist the value itself - the consumer owns
   * storing/reading it (e.g. to `localStorage`), matching `onWidthChange`/`onResizeEnd` below.
   */
  width: number | null;
  /**
   * Called continuously while dragging or on every keyboard step, with the new (already-clamped)
   * end-pane width - mirror this into whatever state backs `width`. Called with `null` only when
   * the handle is double-clicked (see below), never from a drag or keyboard step.
   */
  onWidthChange: (width: number | null) => void;
  /**
   * Fired once when a drag or keyboard interaction *ends* (pointer up, or after a single
   * keyboard step) - the right place for a consumer to persist `width` to its own storage,
   * mirroring "save on release/step, not on every move" from the original hand-rolled behavior.
   * Not called when `width` becomes `null` (double-click reset) - that goes through
   * `onWidthChange` directly, since there's nothing to persist.
   */
  onResizeEnd?: (width: number) => void;
  /**
   * Computes the end pane's default width (px) from the split container's current total width,
   * used whenever `width` is `null`. Tracked via `ResizeObserver`, so it reacts to the container
   * resizing, not just the window. If omitted, defaults to a flat 40% of the container width.
   */
  computeDefaultWidth?: (containerWidth: number) => number;
  /**
   * Minimum width (px) the start pane is ever clamped to. Also the width the start pane is given
   * when Home is pressed on the handle (see the ARIA separator's "primary pane smallest size"
   * behavior) - the start pane is treated as the separator's primary pane.
   * @default 320
   */
  minStartWidth?: number;
  /**
   * Minimum width (px) the end pane is ever clamped to - also the width given to the end pane
   * when End is pressed on the handle.
   * @default 320
   */
  minEndWidth?: number;
  /**
   * Width (px) of the draggable handle column between the panes. Included in the clamping math
   * so the start pane never drops below `minStartWidth` purely because the handle's own width
   * ate the space.
   * @default 12
   */
  handleWidth?: number;
  /**
   * Arrow-key step size (px) per keypress on the handle.
   * @default 16
   */
  step?: number;
  /**
   * Accessible label for the handle (`role="separator"`). Required, since there's no visible text
   * label a `aria-labelledby` could point to by default.
   */
  accessibilityLabel: string;
} & TestID &
  DataAnalyticsAttribute;

type ResizableSplitPaneProps = {
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

export type { ResizableSplitProps, ResizableSplitPaneProps };
