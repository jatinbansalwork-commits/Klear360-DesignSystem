import { describe, expect, it } from 'vitest';
import { mergeStyleOverride } from './mergeStyleOverride';

describe('mergeStyleOverride', () => {
  it('merges provider and instance overrides with instance winning', () => {
    /** @type {import('../styles/shared/styleOverride').StyleOverride<import('../styles/Button/slots').ButtonSlot>} */
    const provider = {
      root: 'provider-cta',
      text: 'provider-label',
    };
    /** @type {import('../styles/shared/styleOverride').StyleOverride<import('../styles/Button/slots').ButtonSlot>} */
    const instance = {
      root: 'instance-cta',
      icon: 'instance-icon',
    };

    expect(mergeStyleOverride(provider, instance)).toEqual({
      root: 'instance-cta',
      text: 'provider-label',
      icon: 'instance-icon',
    });
  });

  it('returns empty object when no overrides are passed', () => {
    expect(mergeStyleOverride()).toEqual({});
  });

  it('skips undefined entries', () => {
    expect(mergeStyleOverride(undefined, { root: 'cta' }, undefined)).toEqual({ root: 'cta' });
  });
});
