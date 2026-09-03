# White Labelling - createTheme

You may want to use Klear360 with brands other than Klear.

To make this possible, Klear360 allows you to customize the theme of the components to match your brand with the `createTheme` function.

## API Reference

### `createTheme()`:

> Returns a `ThemeTokens` object that can be passed to `themeTokens` prop of `Klear360Provider` to customize the branding of all components.

`createTheme()` accepts an object with the following keys:

#### `brandColor`:

- This is the primary color of your brand.
- `createTheme` will generate a color palatte using this brand color which will then be used across Klear360 components to match your brand.
- You can pass any valid CSS color value (rgb, hex or hsl) format to this key.

## Usage

If your application has multiple `Klear360Provider` components, you can pass the `brandColor` to each of them to customize the branding of the components inside them.

```jsx
import { createTheme } from '@klear/klear360/tokens';

const { theme: customThemeTokens } = createTheme({
  brandColor: '#83003D', // 'rgba(131, 0, 61)', 'hsl(332, 100%, 26%)' are also valid values
});

const Wrapper = () => {
  return (
    <Klear360Provider themeTokens={customThemeTokens}>
      <App />
    </Klear360Provider>
  );
};
```

### Light & Dark theme support

Custom branded themes also contain support for light and dark color schemes. You can pass the `colorScheme` prop to `Klear360Provider` to switch between light and dark color schemes.

```jsx
// or colorScheme="light"
<Klear360Provider themeTokens={customThemeTokens} colorScheme="dark">
  <App />
</Klear360Provider>
```
