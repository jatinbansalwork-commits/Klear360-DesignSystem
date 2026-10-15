import { applyTransform } from '@hypermod/utils';
import transformer from '..';

it('should rename sortable to isSortable in an inline columns array', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Table } from '@klear/klear360/components';

    const App = () => (
      <Table
        data={data}
        columns={[
          { key: 'name', header: 'Name', sortable: true, render: (item) => item.name },
          { key: 'age', header: 'Age', render: (item) => item.age },
        ]}
      />
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Table } from '@klear/klear360/components';

        const App = () => (
          <Table
            data={data}
            columns={[
              { key: 'name', header: 'Name', isSortable: true, render: (item) => item.name },
              { key: 'age', header: 'Age', render: (item) => item.age },
            ]}
          />
        );"
  `);
});

it('should rename sortable to isSortable in a standalone columns variable', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Table } from '@klear/klear360/components';

    const columns = [
      { key: 'name', header: 'Name', sortable: true, render: (item) => item.name },
    ];

    const App = () => <Table data={data} columns={columns} />;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Table } from '@klear/klear360/components';

        const columns = [
          { key: 'name', header: 'Name', isSortable: true, render: (item) => item.name },
        ];

        const App = () => <Table data={data} columns={columns} />;"
  `);
});

it('should rename a shorthand sortable property', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Table } from '@klear/klear360/components';

    const sortable = true;
    const columns = [{ key: 'name', header: 'Name', sortable, render: (item) => item.name }];
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Table } from '@klear/klear360/components';

        const sortable = true;
        const columns = [{ key: 'name', header: 'Name', isSortable: sortable, render: (item) => item.name }];"
  `);
});

it('should rename sortable on a local column-config type that mirrors TableColumnConfig', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Table } from '@klear/klear360/components';

    type LinkColumnConfig = {
      key: string;
      header: React.ReactNode;
      sortable?: boolean;
      render: (item) => React.ReactNode;
    };
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Table } from '@klear/klear360/components';

        type LinkColumnConfig = {
          key: string;
          header: React.ReactNode;
          isSortable?: boolean;
          render: (item) => React.ReactNode;
        };"
  `);
});

it('should not rename an unrelated sortable property', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Table } from '@klear/klear360/components';

    const config = { sortable: true, enabled: true };
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Table } from '@klear/klear360/components';

        const config = { sortable: true, enabled: true };"
  `);
});
