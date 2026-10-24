import { useCollapsible } from './CollapsibleContext';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';
import styles from './Collapsible.module.scss';

// Not really an IconComponent, a wrapper is needed for animating the icon inside
const CollapsibleChevronIcon: IconComponent = (props) => {
  const { isExpanded, direction: _direction } = useCollapsible();
  return (
    <BaseBox
      className={[styles.triggerChevron, isExpanded ? styles.chevronExpanded : undefined]
        .filter(Boolean)
        .join(' ')}
      {...makeAccessible({ hidden: true })}
    >
      <ChevronDownIcon {...props} />
    </BaseBox>
  );
};

export { CollapsibleChevronIcon };
