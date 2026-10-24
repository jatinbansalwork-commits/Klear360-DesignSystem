import React from 'react';
import type { BaseBoxProps } from './types';
import { filterForwardableDomProps } from './filterForwardableDomProps';
import { useMemoizedStyles } from './useMemoizedStyles';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/Klear360Provider';
import type { Klear360ElementRef } from '~utils/types';

type BaseBoxWebProps = BaseBoxProps & {
  as?: React.ElementType;
  href?: string;
  to?: string;
  type?: string;
  rel?: string;
  target?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, keyof BaseBoxProps | 'color'>;

const _BaseBox = React.forwardRef<Klear360ElementRef, BaseBoxWebProps>(
  (
    {
      as,
      children,
      className,
      style,
      testID,
      elevation,
      $isCard,
      ...rest
    },
    ref,
  ): React.ReactElement => {
    const { theme } = useTheme();
    const Component = (as ?? 'div') as React.ElementType;

    const memoizedStyle = useMemoizedStyles({
      ...rest,
      elevation: $isCard ? undefined : elevation,
      theme,
    });

    const mergedStyle =
      style !== undefined ? ({ ...memoizedStyle, ...style } as React.CSSProperties) : memoizedStyle;

    const restRecord = rest as Record<string, unknown>;
    const componentName =
      (restRecord['data-klear360-component'] as string | undefined) || MetaConstants.BaseBox;
    const resolvedTestID = (restRecord['data-testid'] as string | undefined) || testID;

    const domProps = filterForwardableDomProps(rest);

    return React.createElement(
      Component,
      {
        ref,
        className,
        style: mergedStyle,
        ...domProps,
        ...metaAttribute({ name: componentName, testID: resolvedTestID }),
        ...makeAnalyticsAttribute(rest as Record<string, unknown>),
      },
      children,
    );
  },
);

_BaseBox.displayName = 'BaseBox';

const BaseBox = assignWithoutSideEffects(
  _BaseBox as React.ForwardRefExoticComponent<
    BaseBoxWebProps & React.RefAttributes<Klear360ElementRef>
  >,
  { componentId: 'BaseBox' },
);

export { BaseBox };
export type { BaseBoxWebProps };
