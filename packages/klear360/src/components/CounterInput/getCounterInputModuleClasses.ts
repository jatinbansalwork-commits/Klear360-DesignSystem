import styles from './CounterInput.module.scss';

type CounterButtonClassProps = {
  size: 'xsmall' | 'medium' | 'large';
  emphasis: 'subtle' | 'intense';
  type: 'decrement' | 'increment';
};

export const getCounterInputRootClass = (): string => styles['counter-input'];

export const getCounterButtonClasses = ({
  size,
  emphasis,
  type,
}: CounterButtonClassProps): string =>
  [
    styles.button,
    styles[`button-${size}`],
    type === 'decrement' ? styles['button-decrement'] : styles['button-increment'],
    emphasis === 'subtle' ? styles['button-subtle'] : styles['button-intense'],
  ].join(' ');
