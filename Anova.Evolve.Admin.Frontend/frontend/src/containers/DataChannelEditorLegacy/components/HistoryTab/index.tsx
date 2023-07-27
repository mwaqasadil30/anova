import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import { AuditRecord, AuditType } from 'api/admin/api';
import { DataChannelId } from 'apps/admin/routes';
import { ReactComponent as ChevronIcon } from 'assets/icons/single-chevron.svg';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MainContent from 'components/layout/MainContent';
import MessageBlock from 'components/MessageBlock';
import PageSubHeader from 'components/PageSubHeader';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(24),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);
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
  [DataChannelId]: string;
}
type FormattedRecordsType = (AuditRecord & {
  username: string | null | undefined;
  timestamp: Date | undefined;
})[];

const recordsDefault: AuditRecord[] = [];

export const utilizedFields = {};
export const utilizedFieldsNamespace = '';

const HistoryTab = () => {
  const params = useParams<RouteParams>();
  const { t } = useTranslation();
  const auditTypeTextMapping = buildAuditTypeTextMapping(t);

  const [pageSize] = useState(25);
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

  const editingObjectId = params[DataChannelId];

  const formatRecords = (
    originalRecords: AuditRecord[]
  ): FormattedRecordsType => {
    return Object.keys(originalRecords)
      .map((i: string) => {
        const index = parseInt(i, 10);
        return originalRecords[index]?.detailRecords?.map((x) =>
          Object.assign(x, {
            username: originalRecords[index].username,
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
      records.reduce((prev, current) => {
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
      fetchAuditHistory({
        domainId,
        itemsPerPage,
        pageIndex,
        type: AuditType.DataChannel,
        transactionId: editingObjectId,
      })
        .then((responseData) => {
          const totalRecords = responseData?.totalRecords || 0;
          setTotalRows(responseData?.totalRecords || 0);
          setPageCount(Math.ceil(totalRecords / itemsPerPage));
        })
        .catch();
    },
    [domainId]
  );

  const refetchRecords = useCallback(() => {
    fetchRecords({
      pageIndex: pageNumber,
      itemsPerPage: pageSize,
    });
  }, [fetchRecords, pageSize, pageNumber, editingObjectId]);
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

  const classes = useStyles();
  return (
    <MainContent>
      <Box mb={2}>
        <Grid container spacing={2} alignItems="center" justify="space-between">
          <Grid item>
            <PageSubHeader className={classes.heading}>
              {t('ui.common.history', 'History')}
            </PageSubHeader>
          </Grid>
          <Grid item>
            <RefreshButton onClick={refetchRecords} />
          </Grid>
        </Grid>
      </Box>

      <Fade
        in={isFetchingInitial || (rows.length === 0 && isFetching)}
        unmountOnExit
      >
        <div>
          {(rows.length === 0 && isFetching) || isFetchingInitial ? (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          ) : null}
        </div>
      </Fade>
      <Fade in={!isFetchingInitial && !!error} unmountOnExit>
        <div>
          {error && (
            <MessageBlock>
              <Typography variant="body2" color="error">
                {t('ui.history.error', 'Unable to retrieve history')}
              </Typography>
            </MessageBlock>
          )}
        </div>
      </Fade>
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

      <Fade in={!isFetchingInitial && !error && rows.length > 0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableActionsAndPagination
              totalRows={totalRows}
              pageIndex={pageNumber}
              pageSize={pageSize}
              align="center"
              items={items}
            />
          </Grid>
          <Grid item xs={12}>
            <DarkFadeOverlay darken={isFetching}>
              <TableContainer>
                <Table
                  aria-label="history table"
                  size="small"
                  {...getTableProps()}
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
          </Grid>
        </Grid>
      </Fade>
    </MainContent>
  );
};

export default HistoryTab;
