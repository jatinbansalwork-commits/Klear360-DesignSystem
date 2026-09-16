import type { StoryFn, Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { createTransactionTableData } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Link } from '~components/Link';
import { CopyIcon, TrashIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';

export default {
  title: 'Components/Table/API',
  component: TableRow,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    item: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableRow props here"
          componentName="TableRow"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableRow>;

const data = createTransactionTableData(5);

const TableTemplate: StoryFn<typeof TableRow> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent data={data} selectionType="multiple">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => {
                return (
                  <TableRow
                    key={index}
                    {...args}
                    item={tableItem}
                    onHover={({ item }) => action('onHover')(item)}
                    onClick={({ item }) => action('onClick')(item)}
                    hoverActions={
                      <>
                        <IconButton
                          accessibilityLabel="Copy"
                          isHighlighted
                          icon={CopyIcon}
                          onClick={() => action('copy')(tableItem)}
                        />
                        <IconButton
                          accessibilityLabel="Delete"
                          isHighlighted
                          icon={TrashIcon}
                          onClick={() => action('delete')(tableItem)}
                        />
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="medium">{tableItem.transactionId}</Code>
                    </TableCell>
                    <TableCell>{tableItem.companyName}</TableCell>

                    <TableCell>
                      <Box display="flex" gap="spacing.3">
                        <Link
                          onClick={() => action('copy')()}
                          isDisabled={args.isDisabled}
                          variant="button"
                          icon={CopyIcon}
                        >
                          Copy
                        </Link>
                        <Link
                          onClick={() => action('delete')()}
                          isDisabled={args.isDisabled}
                          variant="button"
                          icon={TrashIcon}
                        >
                          Delete
                        </Link>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableRowStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableRowStory.storyName = 'TableRow';
