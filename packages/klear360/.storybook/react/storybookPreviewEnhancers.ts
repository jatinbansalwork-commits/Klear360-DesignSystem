import { fn } from 'storybook/test';

const isMockOrAction = (value: unknown): boolean =>
  typeof value === 'function' &&
  ('mock' in value || 'isAction' in value || 'mockImplementation' in value);

/**
 * Storybook 10 disables implicit action args during render. Stories that still use plain
 * `() => {}` handlers need to be upgraded to `fn()` so Actions + play functions work.
 */
export const argsEnhancers = [
  (context: { initialArgs: Record<string, unknown> }): Record<string, unknown> => {
    return Object.entries(context.initialArgs).reduce<Record<string, unknown>>(
      (enhancedArgs, [key, value]) => {
        if (/^on[A-Z]/.test(key) && typeof value === 'function' && !isMockOrAction(value)) {
          enhancedArgs[key] = fn();
        }

        return enhancedArgs;
      },
      {},
    );
  },
];
