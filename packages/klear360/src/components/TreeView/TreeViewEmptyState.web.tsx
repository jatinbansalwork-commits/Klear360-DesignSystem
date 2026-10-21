import React from 'react';
import { componentIds } from './componentIds';
import { TreeViewParentContext, useTreeViewContext } from './useTreeView';
import { TREEVIEW_INDENTATION_PER_LEVEL } from './StyledTreeViewRow.web';
import type { TreeViewEmptyStateProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { EmptyState } from '~components/EmptyState';
import { SearchIcon } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSize, useTheme } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const _TreeViewEmptyState = (props: TreeViewEmptyStateProps): React.ReactElement => {
  const { nodeMap } = useTreeViewContext();
  const parentValue = React.useContext(TreeViewParentContext);
  const { theme } = useTheme();

  const parentLevel = parentValue ? nodeMap[parentValue]?.level ?? 0 : 0;

  return (
    <BaseBox
      // lines content up one indentation step inside the branch it belongs to, same formula
      // StyledTreeViewRow applies to every other row (B8: indentation via padding-left)
      paddingLeft={makeSize(theme.spacing[3] + TREEVIEW_INDENTATION_PER_LEVEL * parentLevel)}
      paddingY="spacing.3"
      {...makeAccessible({ role: 'status' })}
      {...metaAttribute({ name: MetaConstants.TreeViewEmptyState, testID: props.testID })}
    >
      <EmptyState
        size="small"
        asset={props.asset ?? <SearchIcon size="large" color="surface.icon.gray.muted" />}
        title={props.title ?? 'No items found'}
        description={props.description}
      >
        {props.children}
      </EmptyState>
    </BaseBox>
  );
};

/**
 * ### TreeViewEmptyState
 *
 * Renders inside a `TreeViewItem`'s `children` to show "no items" feedback for an on-demand
 * (async) branch whose subtree resolves to zero items, once loading finishes. It is not a row:
 * it's never focusable, selectable, or counted towards the branch's traversal - purely
 * decorative content inside the expanded group.
 *
 * Keep the branch's `hasChildren` prop set (and `isLoading={false}`) so the chevron and
 * expanded state persist once the fetch resolves to an empty list.
 *
 * #### Usage
 *
 * ```jsx
 * <TreeViewItem title="Karnataka" value="karnataka" hasChildren isLoading={isLoading}>
 *   {!isLoading && cities.length === 0 ? (
 *     <TreeViewEmptyState description="No cities match this filter" />
 *   ) : (
 *     cities.map((city) => <TreeViewItem key={city.value} {...city} />)
 *   )}
 * </TreeViewItem>
 * ```
 */
const TreeViewEmptyState = assignWithoutSideEffects(_TreeViewEmptyState, {
  componentId: componentIds.TreeViewEmptyState,
  displayName: componentIds.TreeViewEmptyState,
});

export { TreeViewEmptyState };
