import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import { AuditHistoryDto } from 'api/admin/api';
import { RtuDeviceId } from 'apps/admin/routes';
import { ReactComponent as ChevronIcon } from 'assets/icons/single-chevron.svg';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import RefreshButton from 'components/RefreshButton';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useExpanded, useGroupBy, useSortBy, useTable } from 'react-table';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { buildAuditTypeTextMapping } from 'utils/i18n/enum-to-text';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import useRetrieveAuditHistory from './hooks/useRetrieveAuditHistory';

const StyledChevronIcon = styled(ChevronIcon)`
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
`;

const StyledModificationText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  && {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
`;

interface RouteParams {
  [RtuDeviceId]: string;
}
type FormattedRecordsType = (AuditHistoryDto & {
  username: string | null | undefined;
  timestamp: Date | undefined;
})[];

const recordsDefault: AuditHistoryDto[] = [];

export const utilizedFields = {};
export const utilizedFieldsNamespace = '';

const HistoryTab = () => {
  const params = useParams<RouteParams>();
  const { t } = useTranslation();
  const auditTypeTextMapping = buildAuditTypeTextMapping(t);

  const [pageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [totalRows, setTotalRows] = useState<number>(0);

  const domainId = useSelector(selectActiveDomainId);

  const {
    isFetching,
    isFetchingInitial,
    error,
    data: auditHistoryData,
    fetchData: fetchAuditHistory,
  } = useRetrieveAuditHistory();

  const records = auditHistoryData?.records || recordsDefault;

  const deviceIdParam = params[RtuDeviceId];

  const formatRecords = (
    originalRecords: AuditHistoryDto[]
  ): FormattedRecordsType => {
    return Object.keys(originalRecords)
      .map((i: string) => {
        const index = parseInt(i, 10);
        return originalRecords[index]?.detailRecords?.map((x) =>
          Object.assign(x, {
            username: originalRecords[index].userName,
            timestamp: originalRecords[index].timestamp,
          })
        );
      })
      .flat() as FormattedRecordsType;
  };

  const data = React.useMemo(() => formatRecords(records), [records]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'type',
        // @ts-ignore
        Cell: (props) => auditTypeTextMapping[props.value] || ' ',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Date Time',
        accessor: 'timestamp',
        Cell: (props: any) => {
          const dayAndMonth = props.value.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
          });
          const year = props.value.toLocaleString('en-US', {
            year: 'numeric',
          });
          const time = props.value.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          return `${dayAndMonth} ${year} ${time}`;
        },
      },

      {
        Header: 'Description',
        accessor: 'description',
      },

      {
        Header: 'Field Name',
        accessor: 'fieldName',
      },
      {
        Header: 'Value Before',
        accessor: 'beforeValue',
      },
      {
        Header: 'Value After',
        accessor: 'afterValue',
      },
    ],
    [records]
  );
  const expandedRows = React.useMemo(
    () =>
      records.reduce((prev: Record<string, boolean>, current): Record<
        string,
        boolean
      > => {
        /* eslint-disable-next-line no-param-reassign */
        prev[
          // @ts-ignore
          `timestamp:${current.timestamp}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [records]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    toggleAllRowsExpanded,
  } = useTable(
    {
      // @ts-ignore
      columns,
      initialState: {
        // Pagination
        pageSize,
        pageIndex: pageNumber,
        groupBy: ['timestamp'],
        expanded: expandedRows,
      },
      data,
      disableMultiSort: true,
      manualSortBy: false,
      expandSubRows: true,
    },
    useGroupBy,
    useSortBy,
    useExpanded
  );

  const fetchRecords = useCallback(
    ({
      itemsPerPage,
      pageIndex,
    }: {
      itemsPerPage: number;
      pageIndex: number;
    }) => {
      fetchAuditHistory(deviceIdParam, pageIndex, itemsPerPage)
        .then((responseData) => {
          const totalRecords = responseData?.totalRecordCount || 0;
          setTotalRows(totalRecords);
          setPageCount(Math.ceil(totalRecords / itemsPerPage));
        })
        .catch(() => {});
    },
    [domainId]
  );

  const refetchRecords = useCallback(() => {
    fetchRecords({
      pageIndex: pageNumber,
      itemsPerPage: pageSize,
    });
  }, [fetchRecords, pageSize, pageNumber, deviceIdParam]);
  useEffect(() => {
    refetchRecords();

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  return (
    <Box
      mt={2}
      height="100%"
      display="flex"
      flexDirection="column"
      flexGrow={1}
    >
      <Box my={1} textAlign="right">
        <RefreshButton onClick={refetchRecords} />
      </Box>

      <TransitionErrorMessage in={!isFetchingInitial && !!error} />

      <Fade
        in={!isFetchingInitial && !error && !isFetching && rows.length === 0}
        unmountOnExit
      >
        <div>
          {!isFetchingInitial && !error && !isFetching && rows.length === 0 && (
            <MessageBlock>
              <Box m={2}>
                <SearchCloudIcon />
              </Box>
              <LargeBoldDarkText>
                {t('ui.history.empty', 'No history found')}
              </LargeBoldDarkText>
            </MessageBlock>
          )}
        </div>
      </Fade>

      {isFetching ? (
        <Box textAlign="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box py={1}>
            <TableActionsAndPagination
              toggleAllRows={toggleAllRowsExpanded}
              totalRows={totalRows}
              pageIndex={pageNumber}
              pageSize={pageSize}
              align="center"
              items={items}
            />
          </Box>

          <BoxWithOverflowHidden
            pb={3}
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            <DarkFadeOverlay darken={isFetching} height="100%">
              <TableContainer
                // Use max height here since the amount of rows in the table
                // may not exceed the height of the page. This allows the
                // scrollbar to appear at the bottom of the short table instead
                // of the bottom of the page.
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  display: 'inline-block',
                }}
              >
                <Table
                  aria-label="history table"
                  {...getTableProps()}
                  stickyHeader
                >
                  <TableHead>
                    {headerGroups.map((headerGroup: any) => (
                      <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers
                          .filter((column: any) => !column.isGrouped)
                          .filter((column: any) => column.id !== 'username')

                          .map((column: any) => {
                            const sortDirection = column.isSorted
                              ? column.isSortedDesc
                                ? 'desc'
                                : 'asc'
                              : undefined;
                            return (
                              <TableHeadCell
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                sortDirection={sortDirection}
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
                    {rows.map((row: any) => {
                      prepareRow(row);

                      if (row.isGrouped) {
                        const groupedCell = row.cells.find(
                          (cell: any) => cell.isGrouped
                        );

                        return (
                          <TableGroupedRow {...row.getRowProps()}>
                            {groupedCell && (
                              <TableCell
                                colSpan={visibleColumns.length}
                                {...groupedCell.getCellProps()}
                                style={{
                                  padding: '10px 16px',
                                  verticalAlign: 'middle',
                                }}
                              >
                                <Grid container alignItems="center" spacing={2}>
                                  <Grid item>
                                    <StyledChevronIcon
                                      {...row.getToggleRowExpandedProps()}
                                      {...(row.isExpanded && {
                                        style: { transform: 'rotate(90deg)' },
                                      })}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <div
                                      style={{
                                        fontWeight: 500,
                                        verticalAlign: 'middle',
                                        display: 'flex',
                                      }}
                                    >
                                      {groupedCell.render('Cell')}
                                      <StyledModificationText>
                                        &nbsp;
                                        {
                                          groupedCell.row.subRows[0].values
                                            .username
                                        }{' '}
                                        ({row.subRows.length})
                                      </StyledModificationText>
                                    </div>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            )}
                          </TableGroupedRow>
                        );
                      }

                      return (
                        <TableRow {...row.getRowProps()} style={{ height: 50 }}>
                          {row.cells
                            .filter(
                              (cell: any) =>
                                cell.column.id !== 'timestamp' &&
                                cell.column.id !== 'username'
                            )
                            .map((cell: any) => {
                              return (
                                <TableCell {...cell.getCellProps()}>
                                  {cell.render('Cell')}
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </DarkFadeOverlay>
          </BoxWithOverflowHidden>
        </>
      )}
    </Box>
  );
};

export default HistoryTab;
