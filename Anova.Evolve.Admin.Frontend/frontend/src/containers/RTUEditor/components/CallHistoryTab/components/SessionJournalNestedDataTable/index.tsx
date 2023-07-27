import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { SessionJournalRcmDto, TransactionJournalRcmDto } from 'api/admin/api';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import FormatDateTime from 'components/FormatDateTime';
import Table, {
  TableProps as ITableProps,
} from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer, {
  TableContainerProps as ITableContainerProps,
} from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { StyledUnderlinedCellText } from 'containers/RTUEditor/styles';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Cell,
  Column,
  HeaderGroup,
  Row,
  TableInstance,
  useExpanded,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { buildRtuStatusTypeTextMapping } from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import {
  getColumnWidthForTransactionJournal,
  isRecordDisabledForTransactionTable,
  ParametersDrawerDetails,
  SessionJournalColumnId,
  TransactionJournalColumnId,
  TransactionJournalColumnIdToAriaLabel,
} from '../../helpers';
import ParametersDrawer from '../ParametersDrawer';
import TransactionJournalDataTable from '../TransactionJournalDataTable';

interface TransactionJournalSubRowsProps {
  data: TransactionJournalRcmDto[];
}

const transactionJournalRecordsDefault: TransactionJournalRcmDto[] = [];

// This could be inlined into SubRowAsync, this lets you reuse it across tables
const TransactionJournalSubRows = ({
  data,
}: TransactionJournalSubRowsProps) => {
  const { t } = useTranslation();

  const transactionJournalRecords = data || transactionJournalRecordsDefault;

  // NOTE: The data needs to be memoized to prevent
  // "Maximum update depth exceeded" error
  const records = useMemo(() => [...transactionJournalRecords], [
    transactionJournalRecords,
  ]);

  const rtuStatusTypeTextMapping = buildRtuStatusTypeTextMapping(t);

  const columns: Column<TransactionJournalRcmDto>[] = React.useMemo(
    () => [
      {
        id: TransactionJournalColumnId.TransactionJournalStatus,
        Header: t(
          'enum.rcmcalljournallistfilteroptions.status',
          'Status'
        ) as string,
        accessor: TransactionJournalColumnId.TransactionJournalStatus,
        Cell: (cell) => {
          const journalStatusType = cell.value;

          if (journalStatusType && isNumber(journalStatusType)) {
            return rtuStatusTypeTextMapping[journalStatusType];
          }
          return '';
        },
      },
      {
        id: TransactionJournalColumnId.CreatedDate,
        Header: t('ui.common.created', 'Created') as string,
        accessor: TransactionJournalColumnId.CreatedDate,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: TransactionJournalColumnId.ErrorType,
        Header: t('ui.rcmcalljournal.errortype', 'Error Type') as string,
        accessor: TransactionJournalColumnId.ErrorType,
        Cell: (cell) => {
          const errorType = cell.value;

          if (errorType) {
            return errorType;
          }
          return '';
        },
      },
      {
        id: TransactionJournalColumnId.ErrorDescription,
        Header: t('ui.rcmcalljournal.errordetails', 'Error Details') as string,
        accessor: TransactionJournalColumnId.ErrorDescription,
      },
      {
        id: TransactionJournalColumnId.Duration,
        Header: t(
          'enum.hornertransactionfeildtype.duration',
          'Duration'
        ) as string,
        accessor: TransactionJournalColumnId.Duration,
        Cell: (cell) => {
          const duration = cell.value;

          if (isNumber(duration)) {
            return duration;
          }
          return '';
        },
        sortType: 'number',
      },
      {
        id: TransactionJournalColumnId.RequestParameters,
        Header: t(
          'ui.rcmcalljournal.requestparameters',
          'Request Parameters'
        ) as string,
        accessor: TransactionJournalColumnId.RequestParameters,
        Cell: (cell) => {
          const requestParameters = cell.value;

          if (requestParameters) {
            return (
              <StyledUnderlinedCellText>
                {t('ui.rcm.details', 'Details')}
              </StyledUnderlinedCellText>
            );
          }
          return '';
        },
      },
      {
        id: TransactionJournalColumnId.ResponseParameters,
        Header: t(
          'ui.rcmcalljournal.responseparameters',
          'Response Parameters'
        ) as string,
        accessor: TransactionJournalColumnId.ResponseParameters,
        Cell: (cell) => {
          const responseParameters = cell.value;

          if (responseParameters) {
            return (
              <StyledUnderlinedCellText>
                {t('ui.rcm.details', 'Details')}
              </StyledUnderlinedCellText>
            );
          }
          return '';
        },
      },
    ],
    [t, records]
  );

  const transactionJournalTableInstance = useTable<TransactionJournalRcmDto>(
    {
      initialState: {
        sortBy: [
          {
            id: TransactionJournalColumnId.CreatedDate,
            desc: true,
          },
        ],
      },
      columns,
      data: records,
      disableMultiSort: true,
      disableSortRemove: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
      // Pagination
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  if (data && !data.length) {
    return (
      <tr>
        <td />
        <td>
          {t('ui.callhistory.noTransactionsFound', 'No transaction data found')}
        </td>
      </tr>
    );
  }

  return (
    <>
      {/* 
        Could be using a GenericDataTable to not duplicate the majority of the 
        table code inside this component (<ParametersDialog /> related code) 
        unless this table will have its own specific style changes / features.
      */}
      <TransactionJournalDataTable<TransactionJournalRcmDto>
        tableInstance={transactionJournalTableInstance}
        disableActions
        tableAriaLabelText="Transaction journal table"
        isRecordDisabled={isRecordDisabledForTransactionTable}
        columnIdToAriaLabel={TransactionJournalColumnIdToAriaLabel}
        getColumnWidth={getColumnWidthForTransactionJournal}
        handleRowClick={() => {}}
      />
    </>
  );
};

interface SubRowAsyncProps {
  transactionData?: TransactionJournalRcmDto[];
}

// Component for the api call
const TransactionJournalSubRowAsync = ({
  transactionData,
}: SubRowAsyncProps) => {
  return (
    <TransactionJournalSubRows
      // @ts-ignore
      data={transactionData}
    />
  );
};

const StyledTable = styled(Table)<{ $minWidth?: number }>`
  min-width: ${(props) =>
    props.$minWidth ? `${props.$minWidth}px` : `1100px`};
`;

const StyledDiv = styled.div`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.uniqueLineHeight};
  position: absolute;
  left: 16px;
  font-weight: 500;
`;

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

interface Props<T extends object> {
  tableInstance: TableInstance<T>;
  disableActions: boolean;
  tableAriaLabelText: string;
  minWidth?: number;
  TableProps?: ITableProps;
  TableContainerProps?: ITableContainerProps;
  isRecordDisabled: (record: T) => boolean;
  columnIdToAriaLabel: (columnId: string) => string;
  getColumnWidth: (columnId: string) => number;
  handleDeleteOne?: (record: T) => void;
  handleRowClick: (row: Row<T>) => void;
}

/* 
  The Session Journal (2nd nested) table that contains the (third nested)
  Transaction Journal Table (a <GenericDataTable />)
*/
const SessionJournalNestedDataTable = <T extends object>({
  tableInstance,
  disableActions,
  tableAriaLabelText,
  TableProps,
  TableContainerProps,
  minWidth = 1100,
  isRecordDisabled: isRecordDisabledForSessionJournalDataTable,
  columnIdToAriaLabel,
  getColumnWidth,
  handleDeleteOne,
  handleRowClick,
}: Props<T>) => {
  const { t } = useTranslation();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    rows,
    prepareRow,
  } = tableInstance;

  // Function to render row sub components
  const renderRowSubComponent = React.useCallback(
    ({ transactionData }: SubRowAsyncProps) => (
      <TransactionJournalSubRowAsync transactionData={transactionData} />
    ),
    []
  );

  const [
    parameterDetails,
    setParameterDetails,
  ] = useState<ParametersDrawerDetails | null>();

  const [isParametersDrawerOpen, setIsParametersDrawerOpen] = useState(false);

  const openParametersDrawer = (selectedCell: Cell<SessionJournalRcmDto>) => {
    setParameterDetails({
      label: selectedCell.column.id,
      value: selectedCell.value,
    });
    setIsParametersDrawerOpen(true);
  };

  const closeParametersDrawer = () => {
    setParameterDetails(null);
    setIsParametersDrawerOpen(false);
  };

  const formattedParametersDrawerTitle =
    parameterDetails?.label === SessionJournalColumnId.ResponseParameters
      ? t('ui.rcmcalljournal.responseparameters', 'Response Parameters')
      : t('ui.rcmcalljournal.requestparameters', 'Request Parameters');

  return (
    <>
      <Drawer
        anchor="right"
        open={isParametersDrawerOpen}
        onClose={closeParametersDrawer}
        variant="temporary"
      >
        <DrawerContent style={{ maxWidth: 775, width: 775 }}>
          <ParametersDrawer
            title={formattedParametersDrawerTitle}
            parameterData={parameterDetails?.value}
            cancelCallback={closeParametersDrawer}
          />
        </DrawerContent>
      </Drawer>
      <TableContainer {...TableContainerProps}>
        <StyledTable
          $minWidth={minWidth}
          aria-label={tableAriaLabelText}
          {...getTableProps()}
          {...TableProps}
        >
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup<T>) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers
                  .filter((column) => !column.isGrouped)
                  .map((column) => {
                    const sortDirection = column.isSorted
                      ? column.isSortedDesc
                        ? 'desc'
                        : 'asc'
                      : undefined;

                    const isExpanderCell = column.id === 'expander';
                    return (
                      <TableHeadCell
                        {...(column.canSort
                          ? column.getHeaderProps(column.getSortByToggleProps())
                          : column.getHeaderProps())}
                        aria-label={columnIdToAriaLabel(column.id)}
                        sortDirection={sortDirection}
                        align={isExpanderCell ? 'center' : 'inherit'}
                        style={{
                          lineHeight: '16px',
                          height: 25,
                          minWidth: isExpanderCell
                            ? 40
                            : getColumnWidth(column.id),
                          padding: isExpanderCell ? 0 : '7px 16px',
                        }}
                      >
                        <TableSortLabel
                          active={column.canSort && column.isSorted}
                          direction={sortDirection}
                          hideSortIcon={!column.canSort}
                        >
                          {column.render('Header')}
                        </TableSortLabel>
                      </TableHeadCell>
                    );
                  })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row: Row<T>) => {
              prepareRow(row);

              if (row.isGrouped) {
                const groupedCell = row.cells.find((cell) => cell.isGrouped);
                return (
                  <TableGroupedRow {...row.getRowProps()}>
                    {groupedCell && (
                      <TableCell
                        colSpan={visibleColumns.length}
                        {...groupedCell.getCellProps()}
                        style={{ padding: '10px 16px' }}
                        aria-label={columnIdToAriaLabel(groupedCell.column.id)}
                      >
                        <StyledDiv>{groupedCell.render('Cell')}</StyledDiv>
                        &nbsp;
                      </TableCell>
                    )}
                  </TableGroupedRow>
                );
              }
              return (
                <>
                  <TableRow
                    {...row.getRowProps()}
                    style={{ height: 40, cursor: 'pointer' }}
                    onClick={() => {
                      handleRowClick(row);
                      // Allow expanding table row by clicking anywhere on the row
                      row.toggleRowExpanded();
                    }}
                  >
                    {row.cells
                      .filter((cell) => !cell.isPlaceholder)
                      .map((cell) => {
                        const isExpanderCell = cell.column.id === 'expander';
                        const isInteractiveCell = isExpanderCell;

                        const isRequestParametersCell =
                          cell.column.id ===
                          SessionJournalColumnId.RequestParameters;
                        const isResponseParametersCell =
                          cell.column.id ===
                          SessionJournalColumnId.ResponseParameters;

                        const isParametersCell =
                          isRequestParametersCell || isResponseParametersCell;

                        return (
                          <StyledTableCell
                            {...cell.getCellProps()}
                            onClick={(event) => {
                              if (isInteractiveCell) {
                                event.stopPropagation();
                              }
                              if (isParametersCell) {
                                event.stopPropagation();
                                // @ts-ignore
                                openParametersDrawer(cell);
                              }
                              return undefined;
                            }}
                            aria-label={columnIdToAriaLabel(cell.column.id)}
                            style={{
                              textAlign: isExpanderCell ? 'center' : 'inherit',
                              width: isExpanderCell ? 40 : 'inherit',
                              padding: isExpanderCell ? 0 : '5px 24px 5px 16px',
                            }}
                          >
                            {cell.render('Cell', {
                              disabled: disableActions,
                              handleDelete: handleDeleteOne,
                              isRecordDisabled: isRecordDisabledForSessionJournalDataTable,
                            })}
                          </StyledTableCell>
                        );
                      })}
                  </TableRow>
                  {/* Nested Transaction Journal Table */}
                  {row.isExpanded && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        {renderRowSubComponent({
                          // @ts-ignore
                          transactionData: row.original.transactions,
                        })}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </>
  );
};

export default SessionJournalNestedDataTable;
