/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DataChannelFilter,
  DataChannel_SummaryDto,
  SortDirectionEnum,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Cell as ReactTableCell,
  HeaderGroup,
  Hooks,
  Row,
  useExpanded,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { formatSearchText } from 'utils/api/helpers';
import { toggleOneSelectedRow } from 'utils/ui/deletion';
import NameCell from './components/NameCell';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  AffectedDataChannelListColumnId,
  columnIdToAriaLabel,
  FilterByData,
  getColumnWidth,
} from './helpers';

const StyledTable = styled(Table)`
  min-width: 1100px;
`;

const recordsDefault: DataChannel_SummaryDto[] = [];

interface FetchRecordsRequest {
  filterBy?: DataChannelFilter; // enum
  activeUserId?: string;
  activeDomainId?: string;
  pageIndex: number;
  itemsPerPage?: number;
  filterText?: string;
  sortColumnName?: string;
  sortDirectionTypeId?: SortDirectionEnum;
}

interface Props {
  handleAddSelectedAffectedDataChannels: (
    affectedDataChannel: DataChannel_SummaryDto
  ) => void;
}

const AddAffectedDataChannelsManagerList = ({
  handleAddSelectedAffectedDataChannels,
}: Props) => {
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [apiResponse, setApiResponse] = useState<
    DataChannel_SummaryDto[] | null
  >(null);

  // Filter by
  const [filterByColumn, setFilterByColumn] = useState(
    DataChannelFilter.ShipTo
  );
  const [filterTextValue, setFilterTextValue] = useState('');

  // Pagination
  const [pageSize] = useState(50);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  const records = apiResponse || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, DataChannel_SummaryDto>
  >({});

  const { t } = useTranslation();
  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        id: AffectedDataChannelListColumnId.ShipTo,
        Header: t('ui.problemreport.shipTo', 'Ship To') as string,
        accessor: AffectedDataChannelListColumnId.ShipTo,
      },
      {
        id: AffectedDataChannelListColumnId.AssetTitle,
        Header: t('ui.problemReport.asset', 'Asset') as string,
        accessor: AffectedDataChannelListColumnId.AssetTitle,
        Cell: (props: ReactTableCell<DataChannel_SummaryDto>) => {
          const { row } = props;
          return <NameCell {...props} value={row.original.assetTitle} />;
        },
      },
      {
        id: AffectedDataChannelListColumnId.Description,
        Header: t('ui.common.description', 'Description') as string,
        accessor: AffectedDataChannelListColumnId.Description,
      },
      {
        id: AffectedDataChannelListColumnId.RtuId,
        Header: t('ui.common.rtu', 'RTU') as string,
        accessor: AffectedDataChannelListColumnId.RtuId,
        // NOTE/TODO: Add NameCell once RTU editor is implemented for redirecting
        // This will be commented out since we dont have any RTU details
        // pages implemented
        // Cell: (props: ReactTableCell<ProblemReport_SummaryDto>) => (
        //   <NameCell
        //     {...props}
        //     onClick={(assetId) => updateRouteState({ assetId })}
        //   />
        // ),
      },
      {
        id: AffectedDataChannelListColumnId.Channel,
        Header: t('ui.common.channel', 'Channel') as string,
        accessor: AffectedDataChannelListColumnId.Channel,
      },
      {
        id: AffectedDataChannelListColumnId.BusinessUnit,
        Header: t('ui.problemreport.businessunit', 'Business Unit') as string,
        accessor: AffectedDataChannelListColumnId.BusinessUnit,
      },
      {
        id: AffectedDataChannelListColumnId.Region,
        Header: t('ui.problemreport.region', 'Region') as string,
        accessor: AffectedDataChannelListColumnId.Region,
      },
    ],
    // We need to add selectedRows here to update the checkbox column because
    // react table only renders once and will not change / re-render unless
    // it is added in the dependencies below
    // See: https://stackoverflow.com/questions/66784663/react-table-data-flow-between-outside-and-inside-of-hooks-visiblecolumns-push-in
    [t, selectedRows]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable<DataChannel_SummaryDto>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        // Pagination
        pageSize,
        pageIndex: pageNumber,
      },
      // Grouping
      expandSubRows: true,
      // Sorting
      disableMultiSort: true,
      manualSortBy: true,
      // Pagination
      autoResetPage: true,
      pageIndex: pageNumber,
      manualPagination: true,
    },
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: Hooks<DataChannel_SummaryDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Cell: ({ row }: { row: Row<DataChannel_SummaryDto> }) => {
            return (
              <TableCellCheckbox
                onChange={() => {
                  handleAddSelectedAffectedDataChannels(row.original);
                  // NOTE: Keeping logic below for checkbox UI
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = toggleOneSelectedRow(
                      prevSelectedRows,
                      row,
                      'dataChannelId'
                    );

                    return newSelectedRows;
                  });
                }}
                checked={!!selectedRows[row.original.dataChannelId!] || false}
              />
            );
          },
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);

  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;
  const sortByColumnId = sortBy?.[0]?.id;
  const sortByIsDescending = sortBy?.[0]?.desc;

  const fetchRecords = useCallback(
    ({
      filterBy,
      activeUserId,
      activeDomainId,
      pageIndex,
      itemsPerPage,
      filterText,
      sortColumnName,
      sortDirectionTypeId,
    }: FetchRecordsRequest) => {
      setIsFetching(true);
      // Reset selected rows when fetching records
      setSelectedRows({});

      AdminApiService.ProblemReportService.problemReport_Search(
        filterBy,
        true, // isCountRequred
        activeUserId,
        activeDomainId,
        pageIndex + 1, // The API is 1-indexed
        itemsPerPage,
        formatSearchText(filterText, { addWildcardAsterisks: true }),
        sortColumnName,
        sortDirectionTypeId
      )
        .then((response) => {
          setApiResponse(response.result || []);
          const totalRecords = response.paging?.totalCount || 0;

          setTotalRows(totalRecords);
          setPageCount(Math.ceil(totalRecords / pageSize));
        })
        .catch((error) => {
          setResponseError(error);
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
        });
    },
    []
  );

  const refetchRecords = useCallback(() => {
    fetchRecords({
      pageIndex: pageNumber,
      itemsPerPage: pageSize,
      filterText: filterTextValue,
      filterBy: filterByColumn,
      sortColumnName: sortByColumnId,
      sortDirectionTypeId: sortByIsDescending
        ? SortDirectionEnum.Descending
        : SortDirectionEnum.Ascending,
      activeDomainId: domainId,
      activeUserId: userId,
    });
  }, [
    fetchRecords,
    pageSize,
    pageNumber,
    filterTextValue,
    filterByColumn, // NOTE: Dont make an api call when changing filter by options
    sortByColumnId,
    sortByIsDescending,
    domainId,
    userId,
  ]);

  // Refetch records when things like the table sorting changes
  useUpdateEffect(() => {
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    pageSize,
    pageNumber,
    sortByColumnId,
    sortByIsDescending,
    domainId,
    userId,
  ]);

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setFilterByColumn(filterData.filterByColumn);
    setFilterTextValue(filterData.filterTextValue);
    setPageNumber(0);

    fetchRecords({
      pageIndex: 0,
      itemsPerPage: pageSize,
      filterText: filterData.filterTextValue,
      filterBy: filterData.filterByColumn,
      sortColumnName: sortByColumnId,
      sortDirectionTypeId: sortByIsDescending
        ? SortDirectionEnum.Descending
        : SortDirectionEnum.Ascending,
      activeDomainId: domainId,
      activeUserId: userId,
    });
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  return (
    <div style={{ position: 'relative' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <TableOptions handleFilterFormSubmit={handleFilterFormSubmit} />
        </Grid>
        <Grid item xs={12} style={{ minHeight: 330 }}>
          <Fade in={isFetching} unmountOnExit>
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
                    {t(
                      'ui.addAffectedDataChannels.error',
                      'Unable to retrieve data channels'
                    )}
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
                      {t(
                        'ui.addAffectedDataChannels.empty',
                        'No data channels found'
                      )}
                    </LargeBoldDarkText>
                  </MessageBlock>
                )}
            </div>
          </Fade>
          <Fade in={!isLoadingInitial && !responseError && rows.length > 0}>
            <div>
              <Grid container spacing={2} alignItems="center">
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
                    <TableContainer style={{ maxHeight: 500 }}>
                      <StyledTable
                        aria-label="affected data channels manager table"
                        {...getTableProps()}
                      >
                        <TableHead>
                          {headerGroups.map(
                            (
                              headerGroup: HeaderGroup<DataChannel_SummaryDto>
                            ) => (
                              <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers
                                  .filter((column) => !column.isGrouped)
                                  .map((column) => {
                                    const sortDirection = column.isSorted
                                      ? column.isSortedDesc
                                        ? 'desc'
                                        : 'asc'
                                      : undefined;
                                    const isSelectionCell =
                                      column.id === 'selection';

                                    return (
                                      <TableHeadCell
                                        {...column.getHeaderProps(
                                          column.getSortByToggleProps()
                                        )}
                                        aria-label={columnIdToAriaLabel(
                                          column.id
                                        )}
                                        sortDirection={sortDirection}
                                        align={
                                          isSelectionCell ? 'center' : 'inherit'
                                        }
                                        style={{
                                          lineHeight: '16px',
                                          height: 25,
                                          minWidth: isSelectionCell
                                            ? 40
                                            : getColumnWidth(column.id),
                                          padding: isSelectionCell
                                            ? 0
                                            : '7px 16px',
                                        }}
                                      >
                                        <TableSortLabel
                                          active={
                                            column.canSort && column.isSorted
                                          }
                                          direction={sortDirection}
                                          hideSortIcon={!column.canSort}
                                        >
                                          {column.render('Header')}
                                        </TableSortLabel>
                                      </TableHeadCell>
                                    );
                                  })}
                              </TableRow>
                            )
                          )}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                          {rows.map((row: Row<DataChannel_SummaryDto>) => {
                            prepareRow(row);

                            return (
                              <TableRow
                                {...row.getRowProps()}
                                style={{ height: 40 }}
                              >
                                {row.cells
                                  .filter((cell) => !cell.isPlaceholder)
                                  .map((cell) => {
                                    const isSelectionCell =
                                      cell.column.id === 'selection';
                                    return (
                                      <TableCell
                                        {...cell.getCellProps()}
                                        onClick={
                                          isSelectionCell
                                            ? (event) => event.stopPropagation()
                                            : undefined
                                        }
                                        aria-label={columnIdToAriaLabel(
                                          cell.column.id
                                        )}
                                        style={{
                                          textAlign: isSelectionCell
                                            ? 'center'
                                            : 'inherit',
                                          width: isSelectionCell
                                            ? 40
                                            : 'inherit',
                                          padding: isSelectionCell
                                            ? 0
                                            : '5px 24px 5px 16px',
                                        }}
                                      >
                                        {cell.render('Cell', {
                                          disabled: isFetching,
                                        })}
                                      </TableCell>
                                    );
                                  })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </StyledTable>
                    </TableContainer>
                  </DarkFadeOverlay>
                </Grid>
                <Grid item xs={12}>
                  <TableActionsAndPagination
                    totalRows={totalRows}
                    pageIndex={pageNumber}
                    pageSize={pageSize}
                    align="center"
                    items={items}
                  />
                </Grid>
              </Grid>
            </div>
          </Fade>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddAffectedDataChannelsManagerList;
