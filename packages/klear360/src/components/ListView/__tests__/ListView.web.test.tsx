import React from 'react';
import { ListView } from '../ListView';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
} from '~components/Table';
import assertAccessible from '~utils/testing/assertAccessible.web';

const nodes = [{ id: '1', name: 'Klear' }];

const renderBasicTable = (): React.ReactElement => (
  <Table data={{ nodes }}>
    {(tableData) => (
      <>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {tableData.map((item, index) => (
            <TableRow item={item} key={index}>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </>
    )}
  </Table>
);

describe('<ListView />', () => {
  it('should render its children', () => {
    const { getByText } = renderWithTheme(
      <ListView>
        <div>ListView content</div>
      </ListView>,
    );
    expect(getByText('ListView content')).toBeInTheDocument();
  });

  it('should accept a testID', () => {
    const { getByTestId } = renderWithTheme(<ListView testID="list-view-test">content</ListView>);
    expect(getByTestId('list-view-test')).toBeInTheDocument();
  });

  it('should accept data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <ListView data-analytics-list="orders">content</ListView>,
    );
    expect(container.querySelector('[data-analytics-list="orders"]')).toBeInTheDocument();
  });

  // A Table rendered standalone draws its own rounded border; nested inside ListView it instead
  // relies on ListView's own surface for that border, so it flattens its corners and background
  // to avoid a double border. This is the actual behavior isInsideListView (shared via context)
  // exists to coordinate, not just a visual nicety - test it, not just a smoke render.
  it("should flatten a nested Table's corners and background via the isInsideListView context", () => {
    // The border-radius/background live on TableSurface (two DOM levels up from the actual
    // `role="table"` element: a row-wrapper div, then TableSurface itself), driven by
    // `isInsideListView` from context. jsdom's `getComputedStyle` doesn't reliably resolve
    // border-radius/background-color through styled-components' generated classes here, so this
    // compares the generated utility class names instead - those are a deterministic function of
    // the actual style props TableSurface received, so a different class reliably means different
    // styles were applied, without depending on jsdom's CSS cascade resolution.
    const standalone = renderWithTheme(renderBasicTable());
    const standaloneSurfaceClass = standalone.getByRole('table').parentElement!.parentElement!
      .className;
    standalone.unmount();

    const nested = renderWithTheme(<ListView>{renderBasicTable()}</ListView>);
    const nestedSurfaceClass = nested.getByRole('table').parentElement!.parentElement!.className;

    expect(nestedSurfaceClass).not.toBe(standaloneSurfaceClass);
  });

  it('should have no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ListView>
        <div>ListView content</div>
      </ListView>,
    );
    await assertAccessible(container);
  });
});
