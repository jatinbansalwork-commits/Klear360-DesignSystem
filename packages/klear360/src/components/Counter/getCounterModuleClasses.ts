import type { CounterProps } from './Counter';
import type { SubtleOrIntense } from '~tokens/theme/theme';
import styles from './Counter.module.scss';

type CounterColor = NonNullable<CounterProps['color']>;

export const getCounterModuleClasses = ({
  color,
  emphasis,
  size,
}: {
  color: CounterColor;
  emphasis: SubtleOrIntense;
  size: NonNullable<CounterProps['size']>;
}): string =>
  [
    styles.counter,
    styles[size],
    styles[`color-${color}`],
    styles[`emphasis-${emphasis}`],
  ]
    .filter(Boolean)
    .join(' ');
