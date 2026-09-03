# @klear/i18n

Internationalisation primitives used by Klear360: number and currency
formatting, phone number formatting and validation, and country/flag lookups.

Vendored into this repository so the design system has no external
internationalisation dependency.

## Country flags

`getFlagOfCountry` and `getFlagsForAllCountries` return paths under
`/assets/flags` rather than a remote CDN. Copy the bundled SVGs into whatever
your app serves as its static root so those paths resolve:

```bash
cp -R node_modules/@klear/i18n/lib/assets/flags public/assets/flags
```

Components that render flags (`PhoneNumberInput`, `CountrySelector`) will show
a broken image until this is done.

## Usage

```ts
import { formatNumber, setState } from '@klear/i18n';
import { formatNumberByParts, getCurrencyList } from '@klear/i18n/currency';
```
