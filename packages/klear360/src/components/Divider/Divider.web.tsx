import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAccessible } from '~utils/makeAccessible';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';
import styles from './Divider.module.scss';
import type { DividerProps } from './types';

const _Divider = (
  {
    orientation = 'horizontal',
    dividerStyle = 'solid',
    variant = 'muted',
    thickness = 'thin',
    height,
    width,
    testID,
    ...styledProps
  }: DividerProps,
  ref: React.Ref<Klear360ElementRef>,
): React.ReactElement => {
  const className = [
    styles.divider,
    styles[orientation],
    styles[thickness],
    styles[variant],
    styles[dividerStyle],
  ].join(' ');

  const sizeStyle =
    orientation === 'horizontal'
      ? width !== undefined
        ? { width }
        : undefined
      : height !== undefined
        ? { height }
        : undefined;

  return (
    <BaseBox
      ref={ref as never}
      className={className}
      style={sizeStyle}
      {...metaAttribute({ name: MetaConstants.Divider, testID })}
      {...getStyledProps(styledProps)}
      {...makeAccessible({ role: 'separator' })}
    />
  );
};

const Divider = React.forwardRef(_Divider);

export { Divider };
