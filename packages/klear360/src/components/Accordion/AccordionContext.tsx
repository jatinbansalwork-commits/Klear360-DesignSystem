import { createContext, useContext } from 'react';
import type { AccordionProps } from './types';
import { throwKlear360Error } from '~utils/logger';

type AccordionContextState = {
  expandedIndex?: number;
  defaultExpandedIndex?: number;
  onExpandChange: (expandedIndex: number) => void;
  showNumberPrefix: boolean;
  variant: AccordionProps['variant'];
  numberOfItems: number;
  size: NonNullable<AccordionProps['size']>;
};

type AccordionItemContextState = {
  index?: number;
  isDisabled?: boolean;
};

const AccordionContext = createContext<AccordionContextState | null>(null);
const AccordionItemContext = createContext<AccordionItemContextState>({
  index: undefined,
});

const useAccordion = (): AccordionContextState => {
  const accordionContext = useContext(AccordionContext);
  if (__DEV__) {
    if (!accordionContext) {
      throwKlear360Error({
        message: 'useAccordion should be only used within AccordionContext',
        moduleName: 'AccordionContext',
      });
    }
  }
  return accordionContext!;
};

const useAccordionItemIndex = (): AccordionItemContextState => {
  const accordionItemContext = useContext(AccordionItemContext);
  if (__DEV__) {
    if (!accordionItemContext) {
      throwKlear360Error({
        message: 'AccordionItem* components should be only used within AccordionItem',
        moduleName: 'AccordionContext',
      });
    }
  }
  return accordionItemContext;
};

export type { AccordionContextState };
export { AccordionContext, useAccordion, AccordionItemContext, useAccordionItemIndex };
