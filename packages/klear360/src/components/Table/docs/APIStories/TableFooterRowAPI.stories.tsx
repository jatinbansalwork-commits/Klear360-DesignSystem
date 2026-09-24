import type { StoryFn, Meta } from '@storybook/react-vite';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from '../../TableFooter';
import { createTransactionTableData, formatDate, getTransactionStateColor } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Table/API/TableFooterRow',
  tags: ['autodocs'],
  component: TableFooterRow,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableFooterRow props here"
          componentName="TableFooterRow"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableFooterRow>;

const data = createTransactionTableData(5);

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent data={data}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
                <TableHeaderCell>Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{tableItem.username}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow {...args}>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableFooterRowStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableFooterRowStory.storyName = 'TableFooterRow';
