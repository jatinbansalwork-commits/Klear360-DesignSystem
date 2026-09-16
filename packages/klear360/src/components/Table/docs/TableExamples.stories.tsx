import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TableToolbar,
  TableToolbarActions,
  TableEditableCell,
  TableEditableDropdownCell,
  TablePagination,
} from '../../Table';
import type { TransactionTableItem } from './exampleData';
import { createTransactionTableData, formatDate, getTransactionStateColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import { Tooltip } from '~components/Tooltip';
import { Radio, RadioGroup } from '~components/Radio';
import { CopyIcon, InfoIcon, TrashIcon } from '~components/Icons';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { useTheme } from '~components/Klear360Provider';

const TableMeta: Meta = {
  title: 'Components/Table/Examples',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const ExampleWrapper = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>{title}</Heading>
        {description ? <Text>{description}</Text> : null}
      </Box>
      {children}
    </Box>
  );
};

const basicTableData = createTransactionTableData(5);

export const BasicTable = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Basic Table">
      <Table data={basicTableData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.transactionId}</TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const customCellTableData = createTransactionTableData(5);

export const TableWithCustomCellComponents = (): React.ReactElement => {
  const headerCells = [
    { title: 'Transaction ID', tooltip: 'Unique identifier of the transaction' },
    { title: 'Company Name', tooltip: 'Company the transaction belongs to' },
    { title: 'ETD', tooltip: 'Estimated time of departure' },
    { title: 'Transaction State', tooltip: 'Current state of the transaction' },
  ];

  return (
    <ExampleWrapper title="Table with Custom Cell Components">
      <Table data={customCellTableData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {headerCells.map((headerCell) => (
                  <TableHeaderCell key={headerCell.title}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      flex={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text weight="semibold">{headerCell.title}</Text>
                      <Tooltip content={headerCell.tooltip}>
                        <IconButton
                          onClick={() => console.log('info clicked')}
                          accessibilityLabel="info"
                          icon={InfoIcon}
                        />
                      </Tooltip>
                    </Box>
                  </TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const sortableTableData = createTransactionTableData(5);

export const SortableTable = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Sortable Table">
      <Table
        data={sortableTableData}
        sortFunctions={{
          TRANSACTION_ID: (array) =>
            array.sort((first, second) => first.transactionId.localeCompare(second.transactionId)),
          COMPANY_NAME: (array) =>
            array.sort((first, second) => first.companyName.localeCompare(second.companyName)),
          ETD: (array) => array.sort((first, second) => first.etd.getTime() - second.etd.getTime()),
          TRANSACTION_STATE: (array) =>
            array.sort((first, second) =>
              first.transactionState.localeCompare(second.transactionState),
            ),
        }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="TRANSACTION_ID">Transaction ID</TableHeaderCell>
                <TableHeaderCell headerKey="COMPANY_NAME">Company Name</TableHeaderCell>
                <TableHeaderCell headerKey="ETD">ETD</TableHeaderCell>
                <TableHeaderCell headerKey="TRANSACTION_STATE">Transaction State</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const stickyHeaderFooterTableData = createTransactionTableData(20);

export const TableWithStickyHeaderAndFooter = (): React.ReactElement => {
  const acceptedCount = stickyHeaderFooterTableData.nodes.filter(
    (node) => node.transactionState === 'ACCEPTED',
  ).length;

  return (
    <ExampleWrapper title="Table with Sticky Header & Sticky Footer">
      <Table data={stickyHeaderFooterTableData} isHeaderSticky isFooterSticky height="500px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Transaction State</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.transactionId}</Code>
                  </TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>{acceptedCount} Accepted</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const stickyFirstColumnTableData = createTransactionTableData(20);

export const TableWithStickyFirstColumn = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Table with Sticky First Column">
      <Table data={stickyFirstColumnTableData} isFirstColumnSticky height="500px">
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
                <TableHeaderCell>Shipment #</TableHeaderCell>
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
                  <TableCell>{tableItem.vesselName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={getTransactionStateColor(tableItem.transactionState)}
                    >
                      {tableItem.transactionState}
                    </Badge>
                  </TableCell>
                  <TableCell>{tableItem.shipmentNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const singleSelectableTableData = createTransactionTableData(5);

export const SingleSelectableTable = (): React.ReactElement => {
  const [selectedItem, setSelectedItem] = React.useState<TransactionTableItem | undefined>(
    undefined,
  );

  return (
    <ExampleWrapper title="Single Selectable Table">
      <Table
        data={singleSelectableTableData}
        selectionType="single"
        onSelectionChange={({ values }) => setSelectedItem(values[0])}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
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
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
      <Box marginTop="spacing.3" display="flex" flexDirection="row" gap="spacing.2">
        <Text weight="semibold">Selected Row ID:</Text>
        <Text>{selectedItem?.transactionId}</Text>
      </Box>
    </ExampleWrapper>
  );
};

const multiSelectableTableData = createTransactionTableData(5);

export const MultiSelectableTableWithToolbar = (): React.ReactElement => {
  const [selectedItemsCount, setSelectedItemsCount] = React.useState(0);
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper
      title="Multi Selectable Table with Toolbar"
      description="(Tip: Expand screen width to see layout changes in toolbar)"
    >
      <Table
        data={multiSelectableTableData}
        selectionType="multiple"
        onSelectionChange={({ selectedIds }) => setSelectedItemsCount(selectedIds.length)}
        toolbar={
          <TableToolbar
            title="Showing Recent Transactions"
            selectedTitle={`${selectedItemsCount} Transaction${
              selectedItemsCount > 1 ? 's' : ''
            } Selected`}
          >
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
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
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const zebraStripesTableData = createTransactionTableData(5);

export const MultiSelectableWithZebraStripes = (): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper title="Multi Selectable Table with Zebra Stripes">
      <Table
        data={zebraStripesTableData}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar title="Showing Recent Transactions">
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
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
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const disabledRowsTableData = createTransactionTableData(10);

export const TableWithDisabledRows = (): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper title="Table with Disabled Rows">
      <Table
        data={disabledRowsTableData}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
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
                const isDisabled = ['1', '5', '10'].includes(tableItem.id);
                return (
                  <TableRow key={index} item={tableItem} isDisabled={isDisabled}>
                    <TableCell>
                      <Code size="medium">{tableItem.transactionId}</Code>
                    </TableCell>
                    <TableCell>{tableItem.companyName}</TableCell>
                    <TableCell>
                      <Box display="flex" gap="spacing.3">
                        <Link isDisabled={isDisabled} variant="button" icon={CopyIcon}>
                          Copy
                        </Link>
                        <Link isDisabled={isDisabled} variant="button" icon={TrashIcon}>
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
      </Table>
    </ExampleWrapper>
  );
};

const backgroundColorTableData = createTransactionTableData(5);
type BackgroundEmphasis = 'subtle' | 'moderate' | 'intense';

export const TableWithBackgroundColor = (): React.ReactElement => {
  const [emphasis, setEmphasis] = React.useState<BackgroundEmphasis>('subtle');

  return (
    <Box
      backgroundColor={`surface.background.gray.${emphasis}`}
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box marginBottom="spacing.4">
        <Heading marginBottom="spacing.3">Table on various background colors</Heading>
        <RadioGroup
          label="Select Emphasis Level"
          onChange={({ value }) => setEmphasis(value as BackgroundEmphasis)}
          value={emphasis}
        >
          <Radio value="subtle">subtle</Radio>
          <Radio value="moderate">moderate</Radio>
          <Radio value="intense">intense</Radio>
        </RadioGroup>
      </Box>
      <Table
        selectionType="multiple"
        showStripedRows={true}
        data={backgroundColorTableData}
        backgroundColor={`surface.background.gray.${emphasis}`}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.transactionId}</TableCell>
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
                  <TableCell>{tableItem.vesselName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </Box>
  );
};

const isLoadingTableData = createTransactionTableData(100);

export const TableWithIsLoading = (): React.ReactElement => {
  const { platform } = useTheme();
  const [showData, setShowData] = React.useState(false);
  const onMobile = platform === 'onMobile';

  React.useEffect(() => {
    if (showData) return undefined;
    const timeoutId = setTimeout(() => setShowData(true), 2000);
    return () => clearTimeout(timeoutId);
  }, [showData]);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="400px">
      <Heading>Table with initial isLoading state</Heading>
      <Link variant="button" onClick={() => setShowData(false)}>
        Refresh to show loader again
      </Link>
      <Box marginTop="spacing.4" display="flex">
        <Table
          data={isLoadingTableData}
          selectionType="multiple"
          showStripedRows={true}
          height="400px"
          isLoading={!showData}
          toolbar={
            <TableToolbar>
              <TableToolbarActions>
                <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                  Export
                </Button>
                <Button isFullWidth={onMobile}>Refund</Button>
              </TableToolbarActions>
            </TableToolbar>
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Transaction ID</TableHeaderCell>
                  <TableHeaderCell>Company Name</TableHeaderCell>
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
            </>
          )}
        </Table>
      </Box>
    </Box>
  );
};

const isRefreshingTableData = createTransactionTableData(100);

export const TableWithIsRefreshing = (): React.ReactElement => {
  const { platform } = useTheme();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const onMobile = platform === 'onMobile';

  const handlePageChange = ({ page }: { page: number }): void => {
    if (currentPage === page) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <ExampleWrapper
      title="Table with isRefreshing state"
      description="(Tip: Navigate to next page using the pagination buttons to see an isRefreshing state.)"
    >
      <Table
        data={isRefreshingTableData}
        isRefreshing={isRefreshing}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            onPageChange={handlePageChange}
            defaultPageSize={10}
            onPageSizeChange={console.log}
            showPageSizePicker
            showPageNumberSelector
            currentPage={currentPage}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
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
                  <TableCell>{tableItem.companyName}</TableCell>
                  <TableCell>{formatDate(tableItem.etd)}</TableCell>
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
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const editableCellsTableData = createTransactionTableData(5);

export const TableWithEditableCells = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Table with Editable Cells">
      <Table data={editableCellsTableData} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Transaction ID</TableHeaderCell>
                <TableHeaderCell>ETD</TableHeaderCell>
                <TableHeaderCell>Company Name</TableHeaderCell>
                <TableHeaderCell>Vessel Name</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableEditableCell
                    placeholder="Enter Transaction ID"
                    accessibilityLabel="Transaction ID"
                    validationState="error"
                    errorText="Transaction ID cannot be empty"
                  />
                  <TableEditableCell placeholder="Enter ETD" accessibilityLabel="ETD" />
                  <TableEditableCell
                    placeholder="Enter Company Name"
                    accessibilityLabel="Company Name"
                    defaultValue={tableItem.companyName}
                    validationState="success"
                    successText="Company Name is valid"
                  />
                  <TableEditableDropdownCell>
                    <AutoComplete accessibilityLabel="Vessel Name" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Maersk Essex" value="maersk-essex" />
                        <ActionListItem title="Ever Envoy" value="ever-envoy" />
                        <ActionListItem title="MSC Oscar" value="msc-oscar" />
                        <ActionListItem title="Wan Hai 512" value="wan-hai-512" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

export default TableMeta;
