import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import { SessionJournalRcmDto, RtuDeviceCategory } from 'api/admin/api';
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
import { useGetRtuCategoryByRtuDeviceId } from 'containers/RTUEditor/hooks/useGetRtuCategoryByRtuDeviceId';
import {
  useGetModbusRtuCommLogSessionHistory,
  GetModbusRtuCommLogRequest,
} from 'containers/RTUEditor/hooks/useGetModbusRtuCommLogSessionHistory';
import {
  useGetMetronRtuCommLogSessionHistory,
  GetMetronRtuCommLogRequest,
} from 'containers/RTUEditor/hooks/useGetMetronRtuCommLogSessionHistory';
import {
  useGetHornerRtuCommLogSessionHistory,
  GetHornerRtuCommLogRequest,
} from 'containers/RTUEditor/hooks/useGetHornerRtuCommLogSessionHistory';
import {
  StyledActionColumnText,
  StyledUnderlinedCellText,
} from 'containers/RTUEditor/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
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
  getColumnWidthForSessionJournal,
  isRecordDisabledForSessionJournalTable,
  SessionJournalColumnId,
  sessionJournalColumnIdToAriaLabel,
} from '../../helpers';
import SessionJournalNestedDataTable from '../SessionJournalNestedDataTable';
import TableActionsAndPagination from './components/TableActionsAndPagination';

interface RouteParams {
  rtuDeviceId: string;
}

interface SubRowsProps {
  data: SessionJournalRcmDto[];
  loading: boolean;
  hasError: boolean;
}

const sessionJournalRecordsDefault: SessionJournalRcmDto[] = [];

// This could be inlined into SubRowAsync, this lets you reuse it across tables
const SubRows = ({ data, loading, hasError }: SubRowsProps) => {
  const { t } = useTranslation();

  const sessionJournalRecords = data || sessionJournalRecordsDefault;

  // NOTE: The data needs to be memoized to prevent
  // "Maximum update depth exceeded" error
  const records = useMemo(() => [...sessionJournalRecords], [
    sessionJournalRecords,
  ]);

  const rtuStatusTypeTextMapping = buildRtuStatusTypeTextMapping(t);

  const columns: Column<SessionJournalRcmDto>[] = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: SessionJournalColumnId.Expander, // It needs an ID
        Cell: ({ row }: any) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? (
              <StyledActionColumnText>-</StyledActionColumnText>
            ) : (
              <StyledActionColumnText>+</StyledActionColumnText>
            )}
          </span>
        ),
        // We can override the cell renderer with a SubCell to be used with an expanded row
        SubCell: () => null, // No expander on an expanded row
      },
      {
        id: SessionJournalColumnId.SessionJournalStatus,
        Header: t(
          'enum.rcmcalljournallistfilteroptions.status',
          'Status'
        ) as string,
        accessor: SessionJournalColumnId.SessionJournalStatus,
        Cell: (cell) => {
          const journalStatusType = cell.value;

          if (journalStatusType && isNumber(journalStatusType)) {
            return rtuStatusTypeTextMapping[journalStatusType];
          }
          return '';
        },
      },
      {
        id: SessionJournalColumnId.CreatedDate,
        Header: t('ui.common.created', 'Created') as string,
        accessor: SessionJournalColumnId.CreatedDate,
        Cell: (cell) => {
          return <FormatDateTime date={cell.value} />;
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: SessionJournalColumnId.ErrorType,
        Header: t('ui.rcmcalljournal.errortype', 'Error Type') as string,
        accessor: SessionJournalColumnId.ErrorType,
        Cell: (cell) => {
          const errorType = cell.value;

          if (errorType) {
            return errorType;
          }
          return '';
        },
      },
      {
        id: SessionJournalColumnId.ErrorDescription,
        Header: t('ui.rcmcalljournal.errordetails', 'Error Details') as string,
        accessor: SessionJournalColumnId.ErrorDescription,
      },
      {
        id: SessionJournalColumnId.SessionSource,
        Header: t('ui.rcm.source', 'Source') as string,
        accessor: SessionJournalColumnId.SessionSource,
        Cell: (cell) => {
          const sessionSource = cell.value;

          if (sessionSource) {
            return sessionSource;
          }
          return '';
        },
      },
      {
        id: SessionJournalColumnId.SessionAttemptCount,
        Header: t(
          'ui.rcmcalljournal.attemptnumber',
          'Attempt Number'
        ) as string,
        accessor: SessionJournalColumnId.SessionAttemptCount,
        Cell: (cell) => {
          const attemptCount = cell.value;

          if (isNumber(attemptCount)) {
            return attemptCount;
          }
          return '';
        },
        sortType: 'number',
      },
      {
        id: SessionJournalColumnId.RequestParameters,
        Header: t(
          'ui.rcmcalljournal.requestparameters',
          'Request Parameters'
        ) as string,
        accessor: SessionJournalColumnId.RequestParameters,
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
        id: SessionJournalColumnId.ResponseParameters,
        Header: t(
          'ui.rcmcalljournal.responseparameters',
          'Response Parameters'
        ) as string,
        accessor: SessionJournalColumnId.ResponseParameters,
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
      {
        id: SessionJournalColumnId.Duration,
        Header: t(
          'enum.hornertransactionfeildtype.duration',
          'Duration'
        ) as string,
        accessor: SessionJournalColumnId.Duration,
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
        id: SessionJournalColumnId.CompletedTransactions,
        Header: t(
          'ui.rcmcalljournal.completedtransactions',
          'Completed Transactions'
        ) as string,
        accessor: SessionJournalColumnId.CompletedTransactions,
        Cell: (cell) => {
          const completedTransactions = cell.value;

          if (isNumber(completedTransactions)) {
            return completedTransactions;
          }
          return '';
        },
        sortType: 'number',
      },
      {
        id: SessionJournalColumnId.TotalTransactions,
        Header: t(
          'ui.rcmcalljournal.totaltransactions',
          'Total Transactions'
        ) as string,
        accessor: SessionJournalColumnId.TotalTransactions,
        Cell: (cell) => {
          const totalTransactions = cell.value;

          if (isNumber(totalTransactions)) {
            return totalTransactions;
          }
          return '';
        },
        sortType: 'number',
      },
    ],
    [t, records]
  );

  const sessionJournalTableInstance = useTable<SessionJournalRcmDto>(
    {
      initialState: {
        sortBy: [
          {
            id: SessionJournalColumnId.CreatedDate,
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

  if (loading) {
    return (
      <tr>
        <td />
        <td>{t('ui.common.loading', 'Loading...')}</td>
      </tr>
    );
  }

  if (data && !data.length) {
    return (
      <tr>
        <td />
        <td>{t('ui.callhistory.noSessionsFound', 'No session data found')}</td>
      </tr>
    );
  }

  if (hasError) {
    return (
      <tr>
        <td />
        <td>
          <Typography variant="body2" color="error">
            {t('ui.common.defaultError', 'An unexpected error occurred')}
          </Typography>
        </td>
      </tr>
    );
  }

  return (
    <>
      <SessionJournalNestedDataTable<SessionJournalRcmDto>
        tableInstance={sessionJournalTableInstance}
        disableActions
        tableAriaLabelText="Session journal table"
        isRecordDisabled={isRecordDisabledForSessionJournalTable}
        columnIdToAriaLabel={sessionJournalColumnIdToAriaLabel}
        getColumnWidth={getColumnWidthForSessionJournal}
        handleRowClick={() => {}}
      />
    </>
  );
};

interface SubRowAsyncProps {
  callJournalId: number;
  callTime?: Date | undefined;
}

// Component for the api call
const SubRowAsync = ({ callJournalId, callTime }: SubRowAsyncProps) => {
  const params = useParams<RouteParams>();

  const getRtuCategoryByRtuDeviceIdApi = useGetRtuCategoryByRtuDeviceId(
    params.rtuDeviceId
  );
  const rtuCategoryApiData = getRtuCategoryByRtuDeviceIdApi.data;

  const isHornerRtu = rtuCategoryApiData === RtuDeviceCategory.Horner;
  const isModbusRtu = rtuCategoryApiData === RtuDeviceCategory.Modbus;

  const [
    callHistoryForMetron2,
    setCallHistoryForMetron2,
  ] = useState<GetMetronRtuCommLogRequest>();

  const [
    callHistoryForHorner,
    setCallHistoryForHorner,
  ] = useState<GetHornerRtuCommLogRequest>();

  const [
    callHistoryForModbus,
    setCallHistoryForModbus,
  ] = useState<GetModbusRtuCommLogRequest>();

  useEffect(() => {
    if (isHornerRtu) {
      setCallHistoryForHorner({
        callJournalId,
        deviceId: params.rtuDeviceId,
        callTime,
      });
    } else if (isModbusRtu) {
      setCallHistoryForModbus({
        callJournalId,
        deviceId: params.rtuDeviceId,
        callTime,
      });
    } else {
      setCallHistoryForMetron2({
        callJournalId,
        deviceId: params.rtuDeviceId,
        callTime,
      });
    }
  }, []);

  const getMetronRtuSessionHistoryApi = useGetMetronRtuCommLogSessionHistory(
    callHistoryForMetron2
  );

  const getHornerRtuSessionHistoryApi = useGetHornerRtuCommLogSessionHistory(
    callHistoryForHorner
  );

  const getModbusRtuSessionHistoryApi = useGetModbusRtuCommLogSessionHistory(
    callHistoryForModbus
  );

  const rtuSessionHistoryApiData =
    getMetronRtuSessionHistoryApi.data ||
    getHornerRtuSessionHistoryApi.data ||
    getModbusRtuSessionHistoryApi.data;

  return (
    <SubRows
      // @ts-ignore
      data={rtuSessionHistoryApiData}
      loading={getMetronRtuSessionHistoryApi.isLoading}
      hasError={getMetronRtuSessionHistoryApi.isError}
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
  The first table that contains the (Second nested) Session Journal Table.
*/
const GenericNestedDataTable = <T extends object>({
  tableInstance,
  disableActions,
  tableAriaLabelText,
  TableProps,
  TableContainerProps,
  minWidth = 1100,
  isRecordDisabled,
  columnIdToAriaLabel,
  getColumnWidth,
  handleDeleteOne,
  handleRowClick,
}: Props<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    rows,
    page,
    pageCount,
    prepareRow,
    gotoPage,
    state: { pageIndex, pageSize },
  } = tableInstance;

  const handleChangePage = (event: any, newPage: any) => {
    gotoPage(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageIndex + 1,
    onChange: handleChangePage,
  });

  // Function to render row sub components
  const renderRowSubComponent = React.useCallback(
    ({ callJournalId, callTime }: SubRowAsyncProps) => (
      <SubRowAsync callJournalId={callJournalId} callTime={callTime} />
    ),
    []
  );

  return (
    <>
      <Box py={1}>
        <TableActionsAndPagination
          totalRows={rows.length}
          pageIndex={pageIndex}
          pageSize={pageSize}
          items={items}
          showPaginationControls={pageCount > 1}
          align="left"
        />
      </Box>
      <TableContainer {...TableContainerProps}>
        <StyledTable
          $minWidth={minWidth}
          aria-label={tableAriaLabelText}
          stickyHeader
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
            {page.map((row: Row<T>) => {
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

                        return (
                          <StyledTableCell
                            {...cell.getCellProps()}
                            onClick={
                              isInteractiveCell
                                ? (event) => event.stopPropagation()
                                : undefined
                            }
                            aria-label={columnIdToAriaLabel(cell.column.id)}
                            style={{
                              textAlign: isExpanderCell ? 'center' : 'inherit',
                              maxWidth: isExpanderCell ? 40 : 'inherit',
                              padding: isExpanderCell ? 0 : '5px 24px 5px 16px',
                            }}
                          >
                            {cell.render('Cell', {
                              disabled: disableActions,
                              handleDelete: handleDeleteOne,
                              isRecordDisabled,
                            })}
                          </StyledTableCell>
                        );
                      })}
                  </TableRow>
                  {/* Nested Session Journal Table */}
                  {row.isExpanded && (
                    <TableRow>
                      {/* 
                        Subtracting colSpan by just 1 allows the user to see more
                        nested table data without any visual stutters / table shifting
                        when expanding/collapsing nested tables.
                      */}
                      <TableCell colSpan={visibleColumns.length - 1}>
                        {renderRowSubComponent({
                          // @ts-ignore
                          callJournalId: row.original.callJournalId,
                          // @ts-ignore
                          callTime: row.original.createdDate,
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

export default GenericNestedDataTable;
