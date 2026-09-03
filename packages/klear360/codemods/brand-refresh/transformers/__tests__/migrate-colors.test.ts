import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update the color tokens', async () => {
  const result = await applyTransform(
    transformer,
    `
        const CustomBox = styled(Box)\`
            color: \${theme.colors.feedback.notice.action.background.primary.default.lowContrast};
            backgroundColor: \${getIn(theme.colors, 'surface.background.level3.lowContrast')};

            span {
              color: \${theme.colors.brand.primary[500]};
              backgroundColor: \${theme.colors.brand.gray[200].lowContrast};
            }
        \`
        const App = () => (
            <>
              <CustomBox> Lorem ipsum </CustomBox>
              <Text color="feedback.text.information.lowContrast"> Lorem ipsum </Text>
              <Text color="feedback.text.information.highContrast"> Lorem ipsum </Text>
            </>
          );
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const CustomBox = styled(Box)\`
                color: \${theme.colors.interactive.background.notice.faded};
                backgroundColor: \${getIn(theme.colors, 'surface.background.gray.moderate')};

                span {
                  color: \${theme.colors.surface.background.primary.intense};
                  backgroundColor: \${theme.colors.surface.background.gray.moderate};
                }
            \`
            const App = () => (
                <>
                  <CustomBox> Lorem ipsum </CustomBox>
                  <Text color="feedback.text.information.intense"> Lorem ipsum </Text>
                  <Text color="feedback.text.information.intense"> Lorem ipsum </Text>
                </>
              );"
  `);
});

it('should update token values contextually', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <Box borderRightColor="brand.primary.500" backgroundColor="brand.primary.500"> Lorem ipsum </Box>
          <Text color="brand.primary.500"> Lorem ipsum </Text>
          <MapIcon color="brand.primary.500" />
          <MapIcon color="brand.secondary.500" />
          <MapIcon color="badge.text.blue.lowContrast" />
          <MapIcon color="surface.action.icon.default.lowContrast" />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <Box borderRightColor="surface.border.primary.normal" backgroundColor="surface.background.primary.intense"> Lorem ipsum </Box>
              <Text color="surface.text.primary.normal"> Lorem ipsum </Text>
              <MapIcon color="interactive.icon.primary.normal" />
              <MapIcon color="surface.text.onSea.onSubtle" />
              <MapIcon color="interactive.icon.primary.normal" />
              <MapIcon color="interactive.icon.gray.normal" />
            </>
          );"
  `);
});

it('should create TS error for highContrast tokens', async () => {
  const result = await applyTransform(
    transformer,
    `
    const CustomBox = styled(Box)\`
        color: \${theme.colors.surface.text.subdued.highContrast};
        backgroundColor: \${getIn(theme.colors, 'surface.background.level1.highContrast')};
    \`
    const App = () => (
        <>
          <CustomBox> Lorem ipsum </CustomBox>
          <Text color="surface.text.subtle.highContrast"> Lorem ipsum </Text>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const CustomBox = styled(Box)\`
            color: \${theme.colors.UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN};
            backgroundColor: \${getIn(theme.colors, 'UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN')};
        \`
        const App = () => (
            <>
              <CustomBox> Lorem ipsum </CustomBox>
              <Text color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </Text>
            </>
          );"
  `);
});

it('should update the theme in Klear360Provider', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Klear360Provider } from '@klear/klear360/components';
    import { bankingTheme } from '@klear/klear360/tokens';

    const AppWrapper = () => {
      return (
        <Klear360Provider themeTokens={bankingTheme} colorScheme="light">
          <App />
        </Klear360Provider>
      );
    }

    export default AppWrapper;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Klear360Provider } from '@klear/klear360/components';
        import { klear360Theme } from '@klear/klear360/tokens';

        const AppWrapper = () => {
          return (
            <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
              <App />
            </Klear360Provider>
          );
        }

        export default AppWrapper;"
  `);
});

it('should update the theme in Klear360Provider', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Klear360Provider } from '@klear/klear360/components';
    import { paymentTheme } from '@klear/klear360/tokens';

    const AppWrapper = () => {
      return (
        <Klear360Provider themeTokens={paymentTheme} colorScheme="light">
          <App />
        </Klear360Provider>
      );
    }

    export default AppWrapper;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Klear360Provider } from '@klear/klear360/components';
        import { klear360Theme } from '@klear/klear360/tokens';

        const AppWrapper = () => {
          return (
            <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
              <App />
            </Klear360Provider>
          );
        }

        export default AppWrapper;"
  `);
});
