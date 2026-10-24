import React from 'react';
import styles from './TreeView.module.scss';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { size } from '~tokens/global';

/**
 * One indentation step per depth: the 20px chevron slot + the 4px (spacing.2) gap after it.
 * Every row reserves that slot, so a child's content sits exactly one step to the right of
 * its parent's content (Figma: TreeView.Indentation.level-N = 8 + 24N)
 */
const TREEVIEW_INDENTATION_PER_LEVEL = size[24];

type TreeViewRowProps = BaseBoxProps & {
  level: number;
  style?: React.CSSProperties;
};

const TreeViewRow = ({
  level,
  className,
  style,
  ...rest
}: TreeViewRowProps): React.ReactElement => {
  const levelIndentPx = TREEVIEW_INDENTATION_PER_LEVEL * (level - 1);

  return (
    <BaseBox
      className={[styles.row, className].filter(Boolean).join(' ')}
      style={
        {
          ...style,
          '--tree-view-row-padding-left': `calc(var(--spacing-3) + ${levelIndentPx}px)`,
        } as React.CSSProperties
      }
      {...rest}
    />
  );
};

export { TreeViewRow, TREEVIEW_INDENTATION_PER_LEVEL };
