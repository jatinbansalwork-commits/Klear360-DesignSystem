import React from 'react';
import { fireEvent } from '@testing-library/react';
import { TreeView } from '../TreeView';
import { TreeViewItem } from '../TreeViewItem';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Regression guard for the TreeView.memo investigation (see
 * TreeView/_decisions/decisions.md, "React.memo evaluation"): a selection, expansion, or
 * focus change anywhere in the tree must only re-render the rows whose OWN derived state
 * (isSelected / isExpanded / isTabbable / branch checkbox state) actually changed - not
 * every mounted row.
 *
 * A row that React does not re-render keeps the exact same DOM node for its content (React
 * bails out of reconciling a memoized component whose props and subscribed store slices are
 * unchanged, so it never touches that subtree) - checking DOM node identity across the
 * interaction is therefore a reliable, implementation-agnostic way to assert "this row did
 * not re-render" without instrumenting internals
 */
const NUM_BRANCHES = 10;
const LEAVES_PER_BRANCH = 10;
const TOTAL_ROWS = NUM_BRANCHES + NUM_BRANCHES * LEAVES_PER_BRANCH;

const buildBigTree = (): React.ReactElement[] =>
  Array.from({ length: NUM_BRANCHES }, (_, branchIndex) => (
    <TreeViewItem
      key={`branch-${branchIndex}`}
      title={`Branch ${branchIndex}`}
      value={`branch-${branchIndex}`}
      defaultIsExpanded
    >
      {Array.from({ length: LEAVES_PER_BRANCH }, (_, leafIndex) => (
        <TreeViewItem
          key={`leaf-${branchIndex}-${leafIndex}`}
          title={`Leaf ${branchIndex}-${leafIndex}`}
          value={`leaf-${branchIndex}-${leafIndex}`}
        />
      ))}
    </TreeViewItem>
  ));

describe('<TreeViewItem /> re-render scope', () => {
  it(`sanity check: the tree actually mounts all ${TOTAL_ROWS} rows`, () => {
    const { getAllByRole } = renderWithTheme(
      <TreeView selectionType="multiple">{buildBigTree()}</TreeView>,
    );
    expect(getAllByRole('treeitem')).toHaveLength(TOTAL_ROWS);
  });

  it('selecting one leaf does not re-render an unrelated leaf in a different branch', () => {
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple">{buildBigTree()}</TreeView>,
    );

    const unrelatedLeaf = getByRole('treeitem', { name: 'Leaf 9-9' });
    const unrelatedLeafTextNode = unrelatedLeaf.querySelector('p');

    fireEvent.click(getByRole('treeitem', { name: 'Leaf 0-0' }));

    expect(getByRole('treeitem', { name: 'Leaf 0-0' })).toHaveAttribute('aria-checked', 'true');
    // same DOM node reference across the interaction - proves React bailed out of
    // re-rendering (and re-reconciling) this unrelated row entirely
    expect(getByRole('treeitem', { name: 'Leaf 9-9' }).querySelector('p')).toBe(
      unrelatedLeafTextNode,
    );
  });

  it('selecting one leaf does not re-render an unrelated sibling leaf in the same branch', () => {
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple">{buildBigTree()}</TreeView>,
    );

    const siblingLeaf = getByRole('treeitem', { name: 'Leaf 0-1' });
    const siblingLeafTextNode = siblingLeaf.querySelector('p');

    fireEvent.click(getByRole('treeitem', { name: 'Leaf 0-0' }));

    expect(getByRole('treeitem', { name: 'Leaf 0-0' })).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('treeitem', { name: 'Leaf 0-1' }).querySelector('p')).toBe(
      siblingLeafTextNode,
    );
  });

  it('collapsing one branch does not re-render an unrelated branch', () => {
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple">{buildBigTree()}</TreeView>,
    );

    const unrelatedBranch = getByRole('treeitem', { name: 'Branch 9' });
    const unrelatedBranchTextNode = unrelatedBranch.querySelector('p');

    // row click selects (B1/B5); only the chevron toggles expansion
    const branch5 = getByRole('treeitem', { name: 'Branch 5' });
    const chevron = branch5.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(chevron);

    expect(getByRole('treeitem', { name: 'Branch 5' })).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('treeitem', { name: 'Branch 9' }).querySelector('p')).toBe(
      unrelatedBranchTextNode,
    );
  });

  it('moving roving-tabindex focus does not re-render unrelated rows', () => {
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple">{buildBigTree()}</TreeView>,
    );

    const unrelatedLeaf = getByRole('treeitem', { name: 'Leaf 9-9' });
    const unrelatedLeafTextNode = unrelatedLeaf.querySelector('p');

    fireEvent.focus(getByRole('treeitem', { name: 'Leaf 0-0' }));

    expect(getByRole('treeitem', { name: 'Leaf 0-0' })).toHaveAttribute('tabindex', '0');
    expect(getByRole('treeitem', { name: 'Leaf 9-9' }).querySelector('p')).toBe(
      unrelatedLeafTextNode,
    );
  });
});
