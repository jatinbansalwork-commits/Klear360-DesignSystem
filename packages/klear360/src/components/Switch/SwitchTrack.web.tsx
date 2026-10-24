import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { TrackProps } from './types';
import {
  getSwitchTrackDataAttributes,
  getSwitchTrackModuleClasses,
} from './getSwitchTrackModuleClasses';

type SwitchTrackWebProps = TrackProps & {
  className?: string;
  children?: React.ReactNode;
};

const SwitchTrack = React.forwardRef<HTMLElement, SwitchTrackWebProps>(
  ({ size, isChecked, isDisabled, deviceType: _deviceType, className, ...props }, ref) => (
    <BaseBox
      ref={ref as never}
      {...props}
      {...getSwitchTrackDataAttributes(Boolean(isDisabled))}
      className={[
        getSwitchTrackModuleClasses({ size, isChecked, isDisabled }),
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  ),
);

SwitchTrack.displayName = 'SwitchTrack';

export { SwitchTrack };
