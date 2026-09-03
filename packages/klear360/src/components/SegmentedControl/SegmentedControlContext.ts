import React from 'react';
import type { SegmentedControlSize } from './types';
import { throwKlear360Error } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type SegmentedControlContextProps = {
  selectedValue: string | undefined;
  setSelectedValue: ControllableStateSetter<string>;
  size: SegmentedControlSize;
  isDisabled: boolean;
  name?: string;
  baseId: string;
  totalItems: number;
  firstEnabledValue?: string;
  itemRefs?: React.MutableRefObject<Map<string, HTMLElement>>;
} | null;

const SegmentedControlContext = React.createContext<SegmentedControlContextProps>(null);

const useSegmentedControlContext = (): NonNullable<SegmentedControlContextProps> => {
  const context = React.useContext(SegmentedControlContext);

  if (!context) {
    throwKlear360Error({
      moduleName: 'SegmentedControl',
      message: 'useSegmentedControlContext must be used within SegmentedControl',
    });
  }

  return context!;
};

export { SegmentedControlContext, useSegmentedControlContext };
