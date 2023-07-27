/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  AuditRecord,
  AuditType,
  EvolveRetrieveAuditHistoryByOptionsRequest,
  EvolveRetrieveAuditHistoryByOptionsResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { ReactComponent as ChevronIcon } from 'assets/icons/single-chevron.svg';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MainContent from 'components/layout/MainContent';
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
import { useParams } from 'react-router';
import { useExpanded, useGroupBy, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import { buildAuditTypeTextMapping } from 'utils/i18n/enum-to-text';
import { caseInsensitive } from 'utils/tables';
import TableActionsAndPagination from './components/TableActionsAndPagination';

const StyledPanelTitle = styled(Typography)`
  && {
    font-size: 20px;
    font-weight: 500;
    font-family: 'Work Sans', sans-serif;
  }
`;

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
  assetId: string;
}
type FormattedRecordsType = (AuditRecord & {
  username: string | null | undefined;
  timestamp: Date | undefined;
})[];

const pageNumber = 0;
const pageSize = 10;
const recordsDefault: AuditRecord[] = [];

export const utilizedFields = {};
export const utilizedFieldsNamespace = '';

const HistoryTab = () => {
  const params = useParams<RouteParams>();
  const { t } = useTranslation();
  const auditTypeTextMapping = buildAuditTypeTextMapping(t);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveAuditHistoryByOptionsResponse | null>(null);
  const records =
    apiResponse?.retrieveAuditHistoryByOptionsResult?.records || recordsDefault;

  const [pageCount, setPageCount] = useState<number | undefined>();
  const editingObjectId = params.assetId;

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
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGroupBy,
    useSortBy,
    useExpanded
  );

  const fetchRecords = useCallback(({ itemsPerPage, pageIndex }: any) => {
    setIsFetching(true);

    AdminApiService.GeneralService.retrieveAuditHistoryByOptions_RetrieveAuditHistoryByOptions(
      {
        transactionId: editingObjectId,
        type: AuditType.Asset,
        pageIndex,
        itemsPerPage,
      } as EvolveRetrieveAuditHistoryByOptionsRequest
    )
      .then((response) => {
        setApiResponse(response);
        const totalRecords =
          formatRecords(
            response.retrieveAuditHistoryByOptionsResult?.records || []
          ).length || 0;
        setPageCount(Math.ceil(totalRecords / itemsPerPage));
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  }, []);

  const refetchRecords = useCallback(() => {
    fetchRecords({
      pageIndex: pageNumber,
      itemsPerPage: pageSize,
      type: AuditType.Asset,
      editingObjectId,
    });
  }, [fetchRecords, pageSize, pageNumber, editingObjectId]);
  useEffect(() => {
    refetchRecords();

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
  });

  const classes = useStyles();
  return (
    <MainContent>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <StyledPanelTitle className={classes.heading}>
            {t('ui.common.history', 'History')}
          </StyledPanelTitle>
        </Grid>
        <Grid item>
          <RefreshButton onClick={refetchRecords} />
        </Grid>
      </Grid>

      <Fade
        in={isLoadingInitial || (rows.length === 0 && isFetching)}
        unmountOnExit
      >
        <div>
          {(rows.length === 0 && isFetching) || isLoadingInitial ? (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          ) : null}
        </div>
      </Fade>
      <Fade in={!isLoadingInitial && !!responseError} unmountOnExit>
        <div>
          {responseError && (
            <MessageBlock>
              <Typography variant="body2" color="error">
                {t('ui.history.error', 'Unable to retrieve history')}
              </Typography>
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade
        in={
          !isLoadingInitial &&
          !responseError &&
          !isFetching &&
          rows.length === 0
        }
        unmountOnExit
      >
        <div>
          {!isLoadingInitial &&
            !responseError &&
            !isFetching &&
            rows.length === 0 && (
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

      <Fade in={!isLoadingInitial && !responseError && rows.length > 0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableActionsAndPagination
              totalRows={data.length}
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
