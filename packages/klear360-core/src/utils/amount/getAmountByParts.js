// @ts-nocheck -- Pre-existing, unrelated to the TS-to-JS migration: @klear/i18n's committed
// lib/types/ output is missing the per-subpath declaration folders (currency/, core/, etc.)
// that its own typesVersions field points to, so '@klear/i18n/currency' can't be resolved for
// types. Tracked separately; excluded here so it doesn't block establishing a clean typecheck
// baseline for this package's migration.
import { formatNumberByParts } from '@klear/i18n/currency';

/**
 * Pollyfill function to get around the node 18 error
 *
 * Mirrors the formatting behaviour of the internal i18n library.
 * @param {ReturnType<typeof formatNumberByParts>} parts
 * @returns {ReturnType<typeof formatNumberByParts>}
 */
const stripTrailingZerosFromParts = (parts) => {
  const decimalPart = parts.rawParts
    .filter(({ type }) => type === 'fraction')
    .map(({ value }) => value)
    .join('');

  const hasFraction = parts.rawParts.some(({ type }) => type === 'fraction');

  if (hasFraction && /^0+$/.test(decimalPart)) {
    delete parts.decimal;
    delete parts.fraction;
    parts.rawParts = parts.rawParts.filter(({ type }) => type !== 'decimal' && type !== 'fraction');
  }

  return parts;
};

/**
 * Wrapper around the i18n number-formatting polyfill
 * @type {typeof formatNumberByParts}
 */
const pollyfilledFormatNumberByParts = (value, options) => {
  const parts = formatNumberByParts(value, options);

  if (options?.intlOptions?.trailingZeroDisplay === 'stripIfInteger') {
    return stripTrailingZerosFromParts(parts);
  }

  return parts;
};

/**
 * @typedef {Partial<ReturnType<typeof formatNumberByParts>>} AmountType
 */

/**
 * Returns a parsed object based on the suffix passed in parameters
 * === Logic ===
 * value = 12500.45
 * if suffix === 'decimals' => {
    "integer": "12,500",
    "decimal": ".",
    "fraction": "45",
    "compact": "K",
    "isPrefixSymbol": false,
    "rawParts": [{"type": "integer","value": "12"},{"type": "group","value": ","},{"type": "integer","value": "500"},{"type": "decimal","value": "."},{"type": "fraction","value": "45"}]
}
 * @param {Object} params
 * @param {'decimals' | 'none' | 'humanize'} params.suffix
 * @param {number} params.value
 * @param {import('@klear/i18n/currency').CurrencyCodeType} params.currency
 * @param {number} [params.fractionDigits]
 * @returns {AmountType}
 */
export const getAmountByParts = ({ suffix, value, currency, fractionDigits = 2 }) => {
  try {
    switch (suffix) {
      case 'decimals': {
        const options = {
          intlOptions: {
            maximumFractionDigits: fractionDigits,
            minimumFractionDigits: fractionDigits,
          },
          currency,
        };
        return pollyfilledFormatNumberByParts(value, options);
      }
      case 'humanize': {
        const options = {
          intlOptions: {
            notation: 'compact',
            maximumFractionDigits: 2,
            trailingZeroDisplay: 'stripIfInteger',
          },
          currency,
        };
        return pollyfilledFormatNumberByParts(value, options);
      }

      default: {
        const options = {
          intlOptions: {
            maximumFractionDigits: 0,
            roundingMode: 'floor',
          },
          currency,
        };
        return pollyfilledFormatNumberByParts(value, options);
      }
    }
  } catch (err) {
    return {
      integer: `${value}`,
      currency,
    };
  }
};
