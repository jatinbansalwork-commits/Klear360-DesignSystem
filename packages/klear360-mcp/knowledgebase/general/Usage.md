import { Meta } from '@storybook/addon-docs';

<Meta title="Guides/How to use?" />

# 👀 How to use klear360?

<br />
<br />

> Before starting to use Klear360 make sure you have followed the [installation guide](?path=/docs/guides-how-to-use--docs) and installed all the dependencies like `styled-components`, `fonts` etc.

<br />

## Wrap your App with `Klear360Provider`

Make sure if `Klear360Provider` is not already present in your app, add it to your app entry point.

In some cases, if section of the page is using dark theme while rest of the page is using light theme, you can wrap the section in `Klear360Provider` with `colorScheme` set to `dark`. Although avoid unnecessary usage of Klear360Provider when its not needed.

```jsx
// index.js
import App from './App';
import { Klear360Provider } from '@klear/klear360/components';
import { klear360Theme } from '@klear/klear360/tokens';

function AppWrapper(): JSX.Element {
  return (
    <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
      <App />
    </Klear360Provider>
  );
}

export default AppWrapper;
```

## Mapping Components from Figma to Klear360 in your code

Klear360 is built with **"What you see in Figma is what you get on Code" ** philosophy.

Whenever you get a UI mockup handed over by your designer select the component you want to build. for eg: let's say I want to implement the Export button component from the below mockup.


So to know the klear360 component's name and properties

1. Select the component on Figma
2. Click on the `locator` icon that will take you to component's properties
3. Look at the component properties and copy it in code because the same properties exists on the components shipped.

```jsx
// in your file where you want to implement this
import { Button, DownloadIcon } from '@klear/klear360/components';

<Button variant="secondary" size="medium" icon={DownloadIcon} iconPosition="left">
  Export
</Button>;
```

## Mapping Tokens from Figma to Klear360 in your code

> Tokens are an integral part of design system and are used to store design decisions behind a token(variable) name. That also make things easier to update without you making any change. For this reason **never hardcode** token values in your code but rather use the token name.

Everything that you see on Figma built using Klear360 you'll always find that in code as well.

Let's see how you can spot a token name from figma and write it in your code


Whenever you get a UI mockup handed over by your designer

1. Select the component whose color token you want to use in code up
2. Click on the inspect panel on the left and click on the token name `surface.background.gray.moderate` to copy it and paste it into your code.
   > Remember, don't select the hardcoded `hsla` color value.

```jsx
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    width: 368px;
    background-color: ${theme.colors.surface.background.gray.moderate};
`,
);
```
