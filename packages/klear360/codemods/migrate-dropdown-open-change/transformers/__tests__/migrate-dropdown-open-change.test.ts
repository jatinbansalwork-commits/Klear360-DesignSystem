import { applyTransform } from '@hypermod/utils';
import transformer from '..';

it('should wrap a bare setter passed directly as onOpenChange', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Dropdown, DropdownOverlay } from '@klear/klear360/components';

    const App = () => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
          <DropdownOverlay />
        </Dropdown>
      );
    };
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Dropdown, DropdownOverlay } from '@klear/klear360/components';

        const App = () => {
          const [isOpen, setIsOpen] = React.useState(false);
          return (
            <Dropdown isOpen={isOpen} onOpenChange={(
              {
                isOpen
              }
            ) => setIsOpen(isOpen)}>
              <DropdownOverlay />
            </Dropdown>
          );
        };"
  `);
});

it('should wrap an inline arrow function whose param is named isOpen', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Dropdown } from '@klear/klear360/components';

    const App = () => (
      <Dropdown
        onOpenChange={(isOpen) => {
          setIsDropdownOpen(isOpen);
        }}
      />
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Dropdown } from '@klear/klear360/components';

        const App = () => (
          <Dropdown
            onOpenChange={(
              {
                isOpen
              }
            ) => {
              setIsDropdownOpen(isOpen);
            }}
          />
        );"
  `);
});

it('should wrap an inline arrow function whose param has a different name', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Dropdown } from '@klear/klear360/components';

    const App = () => (
      <Dropdown
        onOpenChange={(open) => {
          setIsSearchActive(open);
        }}
      />
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Dropdown } from '@klear/klear360/components';

        const App = () => (
          <Dropdown
            onOpenChange={(
              {
                isOpen: open
              }
            ) => {
              setIsSearchActive(open);
            }}
          />
        );"
  `);
});

it('should not touch onOpenChange on DropdownOverlay or other components', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { DatePicker, Dropdown, DropdownOverlay } from '@klear/klear360/components';

    const App = () => (
      <>
        <DropdownOverlay onOpenChange={setIsOverlayOpen} />
        <DatePicker onOpenChange={({ isOpen }) => setIsDateOpen(isOpen)} />
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { DatePicker, Dropdown, DropdownOverlay } from '@klear/klear360/components';

        const App = () => (
          <>
            <DropdownOverlay onOpenChange={setIsOverlayOpen} />
            <DatePicker onOpenChange={({ isOpen }) => setIsDateOpen(isOpen)} />
          </>
        );"
  `);
});

it('should leave an already-migrated Dropdown onOpenChange untouched', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Dropdown } from '@klear/klear360/components';

    const App = () => <Dropdown onOpenChange={({ isOpen }) => setIsOpen(isOpen)} />;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Dropdown } from '@klear/klear360/components';

        const App = () => <Dropdown onOpenChange={({ isOpen }) => setIsOpen(isOpen)} />;"
  `);
});
