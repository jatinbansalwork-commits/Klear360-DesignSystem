import React from 'react';
import { View } from 'react-native';
import { ComponentIds } from './componentIds';
import type { ResizableSplitProps, ResizableSplitPaneProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ResizableSplitPane = ({ children }: ResizableSplitPaneProps): React.ReactElement => (
  <View style={{ minWidth: 0, minHeight: 0 }}>{children}</View>
);

const ResizableSplitPane = assignWithoutSideEffects(_ResizableSplitPane, {
  displayName: 'ResizableSplitPane',
  componentId: ComponentIds.ResizableSplitPane,
});

/**
 * Native has no dedicated drag/resize interaction here yet - the pointer-capture-based drag this
 * package's web implementation uses (`setPointerCapture`) has no established gesture-library
 * (PanResponder/react-native-gesture-handler) equivalent anywhere else in this codebase, so
 * building one is net-new, non-trivial work tracked separately rather than attempted here.
 *
 * In the meantime, the two panes stack vertically and are not resizable - a reasonable fallback
 * given two side-by-side panes rarely fit a phone-width screen anyway, and it keeps both panes'
 * content reachable rather than hiding one behind an unsupported drag gesture.
 */
const _ResizableSplit = ({ children }: ResizableSplitProps): React.ReactElement => {
  const [startPane, endPane] = React.Children.toArray(children);
  return (
    <View style={{ flex: 1 }}>
      {startPane}
      {endPane}
    </View>
  );
};

const ResizableSplit = assignWithoutSideEffects(_ResizableSplit, {
  displayName: 'ResizableSplit',
  componentId: ComponentIds.ResizableSplit,
});

export { ResizableSplit, ResizableSplitPane };
