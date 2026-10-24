import type { ReactElement, TransitionEventHandler } from 'react';
import { useRef } from 'react';
import { useCollapsible } from './CollapsibleContext';
import type { CollapsibleBodyContentProps } from './types';
import { getCollapsibleBodyContentBoxProps, getOpacity } from './commonStyles';
import { makeSize } from '~utils';
import { Box } from '~components/Box';
import { useDidUpdate } from '~utils/useDidUpdate';
import BaseBox from '~components/Box/BaseBox';
import styles from './Collapsible.module.scss';

const HEIGHT_EXPANDED = 'auto';
const HEIGHT_COLLAPSED = '0px';

const CollapsibleBodyContent = ({
  children,
  _hasMargin,
}: CollapsibleBodyContentProps): ReactElement => {
  const { isExpanded, defaultIsExpanded, direction } = useCollapsible();
  const collapsibleBodyContentRef = useRef<HTMLDivElement>(null);

  useDidUpdate(() => {
    const collapsibleBodyContentElement = collapsibleBodyContentRef.current;

    if (!collapsibleBodyContentElement) {
      return;
    }

    collapsibleBodyContentElement.style.display = 'block';
    const actualHeight = collapsibleBodyContentElement.scrollHeight;

    if (!isExpanded) {
      requestAnimationFrame(() => {
        collapsibleBodyContentElement.style.height = makeSize(actualHeight);

        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = makeSize(0);
        });
      });
    } else {
      requestAnimationFrame(() => {
        collapsibleBodyContentElement.style.height = makeSize(0);

        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = makeSize(actualHeight);
        });
      });
    }
  }, [isExpanded]);

  const onTransitionEnd: TransitionEventHandler = ({ propertyName }) => {
    const collapsibleBodyContentElement = collapsibleBodyContentRef.current;
    if (propertyName === 'height' && collapsibleBodyContentElement) {
      if (isExpanded) {
        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = HEIGHT_EXPANDED;
        });
      } else {
        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.display = 'none';
        });
      }
    }
  };

  return (
    <BaseBox
      ref={collapsibleBodyContentRef}
      className={styles.bodyContent}
      data-default-expanded={defaultIsExpanded ? 'true' : 'false'}
      data-expanded={isExpanded ? 'true' : 'false'}
      onTransitionEnd={onTransitionEnd}
      style={{
        opacity: getOpacity({ isExpanded }),
        height: defaultIsExpanded ? HEIGHT_EXPANDED : HEIGHT_COLLAPSED,
        display: defaultIsExpanded ? 'block' : 'none',
      }}
    >
      <Box {...getCollapsibleBodyContentBoxProps({ direction, _hasMargin })}>{children}</Box>
    </BaseBox>
  );
};

export { CollapsibleBodyContent };
