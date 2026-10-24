import type { StyledAccordionButtonProps } from './types';
import styles from './Accordion.module.scss';

type AccordionButtonClassProps = StyledAccordionButtonProps & {
  disabled?: boolean;
};

export const getAccordionButtonModuleClasses = ({
  isExpanded,
  variant,
  isFirstItem,
  isLastItem,
}: AccordionButtonClassProps): string => {
  const isFilled = variant === 'filled';
  const isSingleItem = isFirstItem && isLastItem;

  return [
    styles.button,
    isExpanded ? styles.buttonExpanded : undefined,
    isFilled && isFirstItem && !isSingleItem ? styles.filledFirstItem : undefined,
    isFilled && isLastItem && !isExpanded && !isSingleItem
      ? styles.filledLastItemCollapsed
      : undefined,
    isFilled && isSingleItem && !isExpanded ? styles.filledSingleItemCollapsed : undefined,
    isFilled && isSingleItem && isExpanded ? styles.filledSingleItemExpanded : undefined,
  ]
    .filter(Boolean)
    .join(' ');
};
