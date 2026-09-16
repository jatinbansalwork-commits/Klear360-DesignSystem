import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableProps, TableEditableCellProps } from '../../index';
import {
  Table as TableComponent,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '../../index';
import { createTransactionTableData, formatDate } from '../exampleData';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { TableEditableCell, TableEditableDropdownCell } from '~components/Table/TableEditableCell';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { DropdownOverlay } from '~components/Dropdown';

export default {
  title: 'Components/Table/API',
  component: TableEditableCell,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    headerKey: {
      control: {
        disable: true,
      },
    },
    rowDensity: {
      options: ['comfortable', 'normal', 'compact'],
      control: {
        type: 'radio',
      },
      table: {
        category: 'TableProps',
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableEditableCell props here"
          componentName="TableEditableCell"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableEditableCell>;

const data = createTransactionTableData(5);

type TableTemplateProps = TableEditableCellProps & { rowDensity: TableProps<never>['rowDensity'] };

const TableTemplate: StoryFn<TableTemplateProps> = ({ rowDensity, ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent showBorderedCells data={data} rowDensity={rowDensity}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>Username</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableEditableCell
                    {...args}
                    accessibilityLabel="Company Name"
                    defaultValue={tableItem.companyName}
                  />
                  <TableEditableCell
                    accessibilityLabel="Username"
                    validationState="error"
                    placeholder="Username"
                    errorText="Username is invalid"
                  />
                  <TableEditableDropdownCell selectionType="multiple">
                    <AutoComplete
                      accessibilityLabel="Vessel Name"
                      validationState={args.validationState}
                      errorText="Invalid Vessel Name"
                      successText="Valid Vessel Name"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Maersk Essex" value="maersk-essex" />
                        <ActionListItem title="Ever Envoy" value="ever-envoy" />
                        <ActionListItem title="MSC Oscar" value="msc-oscar" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      validationState={args.validationState}
                      accessibilityLabel="Transaction State"
                      errorText="Invalid Transaction State"
                      successText="Valid Transaction State"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Sent" value="sent" />
                        <ActionListItem title="In Process" value="in-process" />
                        <ActionListItem title="Accepted" value="accepted" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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

export const TableEditableCellStory = TableTemplate.bind({});
TableEditableCellStory.args = {
  rowDensity: 'normal',
};
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableEditableCellStory.storyName = 'TableEditableCell';
