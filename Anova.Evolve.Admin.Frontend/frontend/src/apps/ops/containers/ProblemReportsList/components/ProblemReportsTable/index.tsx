/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  PagingResponseModelOfListOfProblemReport_SummaryDto,
  ProblemReport_SummaryDto,
  WatchListTypeEnum,
} from 'api/admin/api';
import { useGetUserWatchlist } from 'apps/ops/hooks/useGetUserWatchlist';
import routes from 'apps/ops/routes';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import FormatDateTime from 'components/FormatDateTime';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import ScrollbarSync from 'components/ScrollbarSync';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Cell as ReactTableCell,
  Column,
  Hooks,
  useBlockLayout,
  useSortBy,
  useTable,
} from 'react-table';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { FixedSizeList } from 'react-window';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import {
  selectCanReadProblemReportDetails,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import styled, { css } from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { buildProblemReportPriorityTextMapping } from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import { getScrollbarWidth } from 'utils/ui/helpers';
import { TableDataForDownload, UpdateRouteStateParams } from '../../types';
import NameCell from '../NameCell';
import TableActionsAndPagination from '../TableActionsAndPagination';
import WatchlistCell from '../WatchlistCell';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  ProblemReportsColumnId,
} from './helpers';

const ROW_HEIGHT = 35;

const StyledTableContainer = styled(TableContainer)`
  overflow-x: auto;
  overflow-y: hidden;
`;
// Hide one of the scrollbars since we have two of them set up:
// 1. One of them is the default scrollbar (which appears all the way on the
//    right side of wide tables). This is the one that is hidden by this styled
//    component.
// 2. The other is the sync scrollbar added to make sure it's always visible no
//    matter the width of the table (the user doesn't need to scroll all the
//    way to the right to see it)
const StyledFixedSizeList = styled(FixedSizeList)`
  /* Chrome + Safari + Edge Chromium */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
`;

const StyledTableRow = styled(({ rowOriginalData, isClickable, ...props }) => (
  <TableRow {...props} />
))`
  height: ${ROW_HEIGHT}px;
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'inherit')};
`;

const StyledTableSortLabel = styled(TableSortLabel)`
  width: 100%;
`;

const sharedTextOverflowStyles = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const OverflowText = styled.span`
  ${sharedTextOverflowStyles}
`;

const StyledTableHeadCell = styled(({ columnId, ...props }) => (
  <TableHeadCell {...props} />
))`
  ${sharedTextOverflowStyles}
  padding: 4px 8px;
`;

const StyledTableCell = styled(TableCell)`
  ${sharedTextOverflowStyles}
  padding: 4px 8px;
`;

const recordsDefault: ProblemReport_SummaryDto[] = [];

interface Props {
  lastRefreshDate?: Date;
  isLoadingInitial?: boolean;
  isFetching?: boolean;
  responseError?: any | null;
  apiResponse?: PagingResponseModelOfListOfProblemReport_SummaryDto | null;
  allDataApiResponse?: PagingResponseModelOfListOfProblemReport_SummaryDto | null;
  pageCount?: number;
  totalRows: number;
  pageSize: number;
  pageNumber: number;
  sortByColumnId?: string | null;
  sortByIsDescending?: boolean | null;
  statusType: ProblemReportStatusFilterEnum;
  selectedProblemReportId?: ProblemReport_SummaryDto['problemReportId'];
  fromDate: moment.Moment;
  toDate: moment.Moment;
  handlePageNumberChange: (pageNumber: number) => void;
  handleSortByChange: (columnId: string, isDescending: boolean) => void;
  updateRouteState: (ids: UpdateRouteStateParams) => void;
  setTableStateForDownload: (tableData: TableDataForDownload) => void;
  handleUpdateFromAndToDates: (
    startDatetime: moment.Moment,
    endDatetime: moment.Moment
  ) => void;
}

const ProblemReportsTable = ({
  isLoadingInitial,
  isFetching,
  responseError,
  apiResponse,
  allDataApiResponse,
  pageNumber,
  pageSize,
  pageCount,
  totalRows,
  sortByColumnId,
  sortByIsDescending,
  statusType,
  selectedProblemReportId,
  fromDate,
  toDate,
  handlePageNumberChange,
  handleSortByChange,
  updateRouteState,
  setTableStateForDownload,
  handleUpdateFromAndToDates,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const isBothStatusTypeSelected =
    statusType === ProblemReportStatusFilterEnum.Both;

  // NOTE: Watchlist-related
  const activeDomainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);
  const getUserWatchlistApi = useGetUserWatchlist(userId, activeDomainId);

  const problemReportIdToWatchlistMapping = useMemo(() => {
    const problemReportWatchlistItems = getUserWatchlistApi.data?.filter(
      (watchlistItem) =>
        watchlistItem.watchListTypeId === WatchListTypeEnum.ProblemReports
    );

    return problemReportWatchlistItems?.reduce<
      Record<number, boolean | undefined>
    >((prev, current) => {
      if (current.intItemId) {
        prev[current.intItemId] = true;
      }
      return prev;
    }, {});
  }, [getUserWatchlistApi.data]);

  // which permission is used here for problem reports? ProblemReportEditorAccess?
  // note: this might need to stay the same since its to redirect to asset details
  const canReadProblemReportDetails = useSelector(
    selectCanReadProblemReportDetails
  );

  const records = apiResponse?.result || recordsDefault;
  const allRecords = allDataApiResponse?.result || recordsDefault;

  const priorityEnumTextMapping = buildProblemReportPriorityTextMapping(t);

  const formatHiddenColumns = isBothStatusTypeSelected
    ? []
    : [ProblemReportsColumnId.Status];

  const hiddenColumns = React.useMemo(() => formatHiddenColumns, [
    formatHiddenColumns.join(','),
  ]);

  const rawColumns: Column<ProblemReport_SummaryDto>[] = [
    {
      id: ProblemReportsColumnId.Status,
      Header: t('ui.problemreport.status', 'Status') as string,
      accessor: (problemReport) => {
        const { isClosed } = problemReport;

        if (isClosed) {
          return t('enum.problemreportstatus.closed', 'Closed');
        }

        return t('enum.problemreportstatus.open', 'Open');
      },
    },
    {
      id: ProblemReportsColumnId.OpenDate,
      Header: t('ui.problemreport.opendate', 'Open date') as string,
      accessor: ProblemReportsColumnId.OpenDate,
      Cell: (cell: Cell<ProblemReport_SummaryDto>) => {
        if (cell.value) {
          return <FormatDateTime date={cell.value} />;
        }
        return '-';
      },
      sortType: sortNullableDates,
      sortDescFirst: true,
    },
    // NOTE:
    // Commented out table headers are used for 'advanced' and 'plant' table views
    // which we do not implement at the moment
    // {
    //   id: ProblemReportsColumnId.PlantStatus,
    //   Header: t('ui.problemreport.plantstatus', 'Plant Status') as string,
    //   accessor: ProblemReportsColumnId.PlantStatus,
    // },
    // {
    //   id: ProblemReportsColumnId.DistributionNote,
    //   Header: t('ui.problemreport.distribution', 'Distribution') as string,
    //   accessor: ProblemReportsColumnId.DistributionNote,
    // },
    // {
    //   id: ProblemReportsColumnId.Owner,
    //   Header: t('ui.problemreport.owner', 'Owner') as string,
    //   accessor: ProblemReportsColumnId.Owner,
    // },
    // {
    //   id: ProblemReportsColumnId.IsAlarmVerified,
    //   Header: t('ui.problemreport.verified', 'Verified') as string,
    //   accessor: (row) => {
    //     if (typeof row.isAlarmVerified === 'boolean') {
    //       return formatAndTranslateBoolean(row?.isAlarmVerified, t);
    //     }
    //     return '';
    //   },
    // },
    {
      id: ProblemReportsColumnId.ShipTo,
      Header: t('ui.problemreport.shipTo', 'Ship To') as string,
      accessor: ProblemReportsColumnId.ShipTo,
    },
    {
      id: ProblemReportsColumnId.AssetTitle,
      Header: t('ui.problemReport.asset', 'Asset') as string,
      accessor: ProblemReportsColumnId.AssetTitle,
      Cell: (props: ReactTableCell<ProblemReport_SummaryDto>) => (
        <NameCell
          {...props}
          onClick={(assetId) => updateRouteState({ assetId })}
        />
      ),
    },
    {
      id: ProblemReportsColumnId.City,
      Header: t('ui.common.city', 'City') as string,
      accessor: ProblemReportsColumnId.City,
    },
    {
      id: ProblemReportsColumnId.State,
      Header: t('ui.common.state', 'State') as string,
      accessor: ProblemReportsColumnId.State,
    },
    {
      id: ProblemReportsColumnId.WorkOrderNumber,
      Header: t('ui.problemreport.workorder', 'Work Order') as string,
      accessor: ProblemReportsColumnId.WorkOrderNumber,
    },
    {
      id: ProblemReportsColumnId.Description,
      Header: t('ui.common.description', 'Description') as string,
      accessor: ProblemReportsColumnId.Description,
      sortType: caseInsensitive,
    },
    {
      id: ProblemReportsColumnId.CurrentOpStatus,
      Header: t(
        'ui.packetretrieval.currentopstatus',
        'Current Op Status'
      ) as string,
      accessor: ProblemReportsColumnId.CurrentOpStatus,
      sortType: 'alphanumeric',
    },
    {
      id: ProblemReportsColumnId.RtuId,
      Header: t('ui.common.rtu', 'RTU') as string,
      accessor: ProblemReportsColumnId.RtuId,
      // NOTE/TODO: Use problem reports specific type for cell below.
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
      id: ProblemReportsColumnId.Priority,
      Header: t('ui.problemreport.priority', 'Priority') as string,
      accessor: ProblemReportsColumnId.Priority,
      Cell: (cell: Cell<ProblemReport_SummaryDto>) => {
        const value = cell.value as ProblemReport_SummaryDto[ProblemReportsColumnId.Priority];

        if (isNumber(value)) {
          const priorityEnumValue = priorityEnumTextMapping[value!];
          return priorityEnumValue;
        }
        return '';
      },
    },
    {
      id: ProblemReportsColumnId.BusinessUnit,
      Header: t('ui.problemreport.businessunit', 'Business Unit') as string,
      accessor: ProblemReportsColumnId.BusinessUnit,
    },
    {
      id: ProblemReportsColumnId.Region,
      Header: t('ui.problemreport.region', 'Region') as string,
      accessor: ProblemReportsColumnId.Region,
    },
    {
      id: ProblemReportsColumnId.Tags,
      Header: t('ui.common.tags', 'Tags') as string,
      accessor: ProblemReportsColumnId.Tags,
    },
    {
      id: ProblemReportsColumnId.ProblemNumber,
      Header: t('ui.problemreport.problemid', 'Problem ID') as string,
      accessor: ProblemReportsColumnId.ProblemNumber,
    },
  ];
  const tableColumns = useMemo(
    () =>
      rawColumns.map((column) => ({
        ...column,
        width: getColumnWidth(column.id!),
      })),
    [rawColumns]
  );

  const data = React.useMemo(() => records, [records]);
  const allRecordsData = React.useMemo(() => allRecords, [allRecords]);
  const columns = React.useMemo(() => tableColumns, [
    records,
    statusType,
    canReadProblemReportDetails,
    problemReportIdToWatchlistMapping,
  ]);

  // react table does all its internal functions based off id. id must be consistent throughtout all data going in and out of the table.
  const tableInstance = useTable<ProblemReport_SummaryDto>(
    {
      columns,
      initialState: {
        // NOTE/TODO: We might have to hide columns if we keep the basic/advanced/plant table views
        hiddenColumns,
        sortBy:
          sortByColumnId &&
          // Check if the column exists before attempting to sort. This
          // prevents the react-table error:
          // TypeError: Cannot read property 'sortDescFirst' of undefined
          columns.find((column: any) => column?.id === sortByColumnId)
            ? [
                {
                  id: sortByColumnId,
                  desc: !!sortByIsDescending,
                },
              ]
            : [],
        pageSize,
        pageIndex: pageNumber,
      },
      data,
      disableMultiSort: true,
      // We sort on the client side by `statusType` only when statusType is Open.
      // Otherwise, we let the back-end do the sorting.
      manualSortBy: statusType !== ProblemReportStatusFilterEnum.Open,
      // Note this is for the actual table, not the CSV-related table which is below
      pageIndex: pageNumber,
    },
    useSortBy,
    // useBlockLayout is necesssary when virtualizing the table
    useBlockLayout,
    (hooks: Hooks<ProblemReport_SummaryDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: ProblemReportsColumnId.Action,
          Header: '',
          defaultCanSort: false,
          disableSortBy: true,
          width: getColumnWidth(ProblemReportsColumnId.Action),
          Cell: (cell: Cell<ProblemReport_SummaryDto>) => {
            const isInWatchlist = !!problemReportIdToWatchlistMapping?.[
              cell.row.original.problemReportId!
            ];

            return (
              <WatchlistCell
                userId={userId}
                domainId={activeDomainId}
                isInWatchlist={isInWatchlist}
                record={cell.row.original}
                {...cell}
              />
            );
          },
        },
        ...hookColumns,
      ]);
    }
  );
  const {
    headerGroups,
    rows,
    state: { sortBy },
    getTableProps,
    getTableBodyProps,
    prepareRow,
    toggleSortBy,
    setHiddenColumns,
  } = tableInstance;

  // The table instance used to generate data for a CSV download/export
  const allDataTableInstanceForCsv = useTable<ProblemReport_SummaryDto>(
    {
      columns,
      initialState: {
        // NOTE/TODO: We might have to hide columns if we keep the basic/advanced/plant table views
        hiddenColumns: isBothStatusTypeSelected
          ? ['action']
          : ['action', ProblemReportsColumnId.Status],
        sortBy:
          sortByColumnId &&
          // Check if the column exists before attempting to sort. This
          // prevents the react-table error:
          // TypeError: Cannot read property 'sortDescFirst' of undefined
          columns.find((column: any) => column?.id === sortByColumnId)
            ? [
                {
                  id: sortByColumnId,
                  desc: !!sortByIsDescending,
                },
              ]
            : [],
        pageSize,
        pageIndex: pageNumber,
      },
      data: allRecordsData,
      disableMultiSort: true,
      // We sort on the client side by `displayPriority` only when assets have
      // been grouped (denoed by `isSortByDisabled`). Otherwise, we let the
      // back-end do the sorting.
      // manualSortBy: true
      // Props here are for CSV-related
      pageIndex: pageNumber,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useSortBy,
    // useBlockLayout is necesssary when virtualizing the table
    useBlockLayout
  );

  const tableSortByColumnId = sortBy?.[0]?.id;
  const tableSortByColumnIsDescending = sortBy?.[0]?.desc;

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  // Sort records via the API when clicking on a table column
  useUpdateEffect(() => {
    handleSortByChange(tableSortByColumnId, !!tableSortByColumnIsDescending);
  }, [tableSortByColumnId, tableSortByColumnIsDescending]);

  // Set the table's sort state when the sorting values are changed outside the
  // table
  useUpdateEffect(() => {
    if (sortByColumnId) {
      // Check if the column exists before attempting to sort. This
      // prevents the react-table error:
      // TypeError: Cannot read property 'sortDescFirst' of undefined
      const doesColumnExist = columns.find(
        (column: any) => column?.id === sortByColumnId
      );
      if (doesColumnExist) {
        toggleSortBy(sortByColumnId, !!sortByIsDescending, false);
      }
    }
  }, [sortByColumnId, sortByIsDescending]);

  // Set the data to be used when exporting the table data to a CSV.
  // useDebounce is used since the table was being updated quickly (only twice)
  // which was causing the CSV file to be downloaded multiple times.
  useEffect(() => {
    if (allRecordsData.length) {
      setTableStateForDownload({
        rows: allDataTableInstanceForCsv.rows,

        visibleColumns: allDataTableInstanceForCsv.visibleColumns.filter(
          (column) => column.id !== 'action'
        ),
      });
    }
  }, [allRecordsData]);

  const handleChangePage = (event: any, newPage: any) => {
    handlePageNumberChange(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  // Syncing scroll between the virtualized table and a fake scrollbar
  // overlapping the table's scrollbar. This was needed b/c the virtualized
  // table's vertical scrollbar was only visible when scrolling all the way to
  // the right.
  const scrollBarSize = React.useMemo(() => getScrollbarWidth(), []);
  const syncScrollbarRef = useRef<HTMLDivElement>(null);
  const virtualizedListRef = useRef<FixedSizeList>(null);
  useEffect(() => {
    if (!isLoadingInitial && !responseError && rows.length > 0) {
      const syncScrollbarListener = () => {
        if (isNumber(syncScrollbarRef.current?.scrollTop)) {
          virtualizedListRef.current?.scrollTo(
            syncScrollbarRef.current?.scrollTop!
          );
        }
      };

      syncScrollbarRef.current?.addEventListener(
        'scroll',
        syncScrollbarListener
      );

      return () => {
        syncScrollbarRef.current?.removeEventListener(
          'scroll',
          syncScrollbarListener
        );
      };
    }

    return () => {};
  }, [isLoadingInitial, responseError, rows.length]);

  const globalHeaderGroupWidth = headerGroups.reduce(
    (globalGroupWidth, headerGroup) => {
      const headerGroupWidth = headerGroup.headers
        .filter((column) => !column.isGrouped)
        .reduce(
          (prevWidth, column) => prevWidth + ((column.width as number) || 0),
          0
        );

      return headerGroupWidth + globalGroupWidth;
    },
    0
  );

  const memoizedGlobalHeaderGroupWidth = React.useMemo(
    () => globalHeaderGroupWidth,
    [globalHeaderGroupWidth]
  );

  const RenderRow = useCallback(
    ({ index, style, data: itemData }) => {
      const row = rows[index];
      prepareRow(row);
      const problemReportIdString = row.original.problemReportId?.toString();

      return (
        <StyledTableRow
          {...row.getRowProps({
            style: {
              ...style,
            },
          })}
          component="div"
          {...(canReadProblemReportDetails && {
            onClick: () => {
              updateRouteState({
                problemReportId: problemReportIdString || '',
              });
              history.push(
                generatePath(routes.problemReports.edit, {
                  problemReportId: row.original.problemReportId,
                })
              );
            },
          })}
          rowOriginalData={row.original}
          isClickable={canReadProblemReportDetails}
        >
          {row.cells
            .filter((cell) => !cell.column.isGrouped)
            .map((cell) => {
              const isActionCell = cell.column.id === 'action';
              const isAssetTitleCell =
                cell.column.id === ProblemReportsColumnId.AssetTitle;
              const cellProps = cell.getCellProps();
              const hasOnClickHandler = isActionCell || isAssetTitleCell;

              // Adjust the widths of the columns if they don't add up to the
              // full width of the page.
              let columnWidth = Number(cell.column.width);
              if (
                itemData.fullPageWidth >
                memoizedGlobalHeaderGroupWidth + scrollBarSize
              ) {
                columnWidth =
                  (columnWidth /
                    (memoizedGlobalHeaderGroupWidth + scrollBarSize)) *
                  itemData.fullPageWidth;
              }

              return (
                <StyledTableCell
                  {...cellProps}
                  style={{
                    ...cellProps.style,
                    textAlign: isActionCell ? 'center' : 'inherit',
                    width: isActionCell ? 35 : columnWidth,
                    padding: isActionCell ? 0 : '7px 8px',
                  }}
                  component="div"
                  aria-label={columnIdToAriaLabel(cell.column.id)}
                  title={
                    // Prevent cases when cell.value is an object (ex: a date)
                    typeof cell.value === 'string' ? cell.value : undefined
                  }
                  onClick={
                    hasOnClickHandler
                      ? (event) => event.stopPropagation()
                      : undefined
                  }
                >
                  {cell.render('Cell')}
                </StyledTableCell>
              );
            })}
        </StyledTableRow>
      );
    },
    [prepareRow, rows, memoizedGlobalHeaderGroupWidth]
  );

  // #region Preserve table scroll state
  // Scroll to previously selected row
  useEffect(() => {
    if (
      selectedProblemReportId &&
      !isFetching &&
      !responseError &&
      records.length
    ) {
      const selectedRecordIndex = rows.findIndex(
        (row) =>
          selectedProblemReportId &&
          row.original?.problemReportId === selectedProblemReportId
      );
      if (selectedRecordIndex >= 0) {
        virtualizedListRef.current?.scrollToItem(selectedRecordIndex, 'center');
      }
    }
  }, [isFetching, responseError, records.length, selectedProblemReportId]);
  // #endregion Preserve table scroll state

  const isEmptyCase =
    !isLoadingInitial && !responseError && !isFetching && rows.length === 0;
  const isNonEmptyCase = !isLoadingInitial && !responseError && rows.length > 0;

  return (
    <div style={{ height: '100%' }}>
      {/*
        NOTE: For some reason using the <DarkFadeOverlay /> component causes
        virtualization performance issues. Not sure how the issue is happening.
      */}
      {isFetching && <FullPageLoadingOverlay />}
      <TransitionErrorMessage in={!isLoadingInitial && !!responseError} />

      <Fade in={isEmptyCase} unmountOnExit>
        <div>
          {isEmptyCase && (
            <>
              <Box paddingBottom={1}>
                <TableActionsAndPagination
                  totalRows={totalRows}
                  pageIndex={pageNumber}
                  pageSize={pageSize}
                  items={items}
                  align="center"
                  statusType={statusType}
                  isFetching={isFetching}
                  fromDate={fromDate}
                  toDate={toDate}
                  isEmptyCase={isEmptyCase}
                  handleUpdateFromAndToDates={handleUpdateFromAndToDates}
                />
              </Box>
              <MessageBlock>
                <Box m={2}>
                  <SearchCloudIcon />
                </Box>
                <LargeBoldDarkText>
                  {t('ui.problemReports.empty', 'No problem reports found')}
                </LargeBoldDarkText>
              </MessageBlock>
            </>
          )}
        </div>
      </Fade>

      <Fade
        in={isNonEmptyCase}
        // Only apply full-height styles when there are records to show.
        // Otherwise, this non-empty content will make the page scrollable.
        style={isNonEmptyCase ? { height: '100%' } : {}}
      >
        <div
          style={
            isNonEmptyCase
              ? {
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }
              : {}
          }
        >
          {isNonEmptyCase && (
            <>
              <Box paddingBottom={1}>
                <TableActionsAndPagination
                  totalRows={totalRows}
                  pageIndex={pageNumber}
                  pageSize={pageSize}
                  items={items}
                  align="center"
                  statusType={statusType}
                  isFetching={isFetching}
                  fromDate={fromDate}
                  toDate={toDate}
                  handleUpdateFromAndToDates={handleUpdateFromAndToDates}
                />
              </Box>
              <Box my={1} height="100%" position="relative">
                {/*
                NOTE: Need to set an explicit height on AutoSizer, otherwise,
                the height defaults to 0 and the table borders dont get
                displayed
              */}
                <AutoSizer style={{ height: 30 }}>
                  {({ height, width }) => {
                    // All rows + 1 for the header, + scrollBarSize for the
                    // bottom horizontal scrollbar
                    const calculatedTableHeight =
                      (rows.length + 1) * ROW_HEIGHT;

                    const isHorizontalScrollbarHidden =
                      width > globalHeaderGroupWidth + scrollBarSize;
                    const horizontalScrollbarSize = isHorizontalScrollbarHidden
                      ? 0
                      : scrollBarSize;
                    const tableWrapperHeight =
                      height >
                      rows.length * ROW_HEIGHT + horizontalScrollbarSize
                        ? calculatedTableHeight + horizontalScrollbarSize
                        : height + horizontalScrollbarSize;
                    return (
                      <StyledTableContainer
                        style={{
                          height: tableWrapperHeight,
                          width,
                        }}
                      >
                        <Table
                          // @ts-ignore
                          component="div"
                          {...getTableProps()}
                          aria-label="problem reports table"
                          size="small"
                          stickyHeader
                          style={{ borderTop: 0, width }}
                        >
                          <TableHead
                            // @ts-ignore
                            component="div"
                          >
                            {headerGroups.map((headerGroup) => {
                              const headerGroupProps = headerGroup.getHeaderGroupProps();
                              return (
                                <TableRow
                                  component="div"
                                  {...headerGroupProps}
                                  style={{
                                    ...headerGroupProps.style,
                                    width: isHorizontalScrollbarHidden
                                      ? width
                                      : globalHeaderGroupWidth + scrollBarSize,
                                  }}
                                >
                                  {headerGroup.headers
                                    .filter((column) => !column.isGrouped)
                                    .map((column) => {
                                      const isActionCell =
                                        column.id === 'action';
                                      const columnProps = column.getHeaderProps(
                                        column.getSortByToggleProps()
                                      );
                                      const sortDirection = column.isSorted
                                        ? column.isSortedDesc
                                          ? 'desc'
                                          : 'asc'
                                        : undefined;

                                      let columnWidth = Number(column.width);
                                      if (isHorizontalScrollbarHidden) {
                                        columnWidth =
                                          (columnWidth /
                                            (globalHeaderGroupWidth +
                                              scrollBarSize)) *
                                          width;
                                      }

                                      return (
                                        <StyledTableHeadCell
                                          component="div"
                                          {...columnProps}
                                          align={
                                            isActionCell ? 'center' : 'inherit'
                                          }
                                          style={{
                                            ...columnProps.style,
                                            width: isActionCell
                                              ? 35
                                              : columnWidth,
                                            padding: isActionCell
                                              ? 0
                                              : '7px 16px',
                                          }}
                                          sortDirection={sortDirection}
                                          aria-label={columnIdToAriaLabel(
                                            column.id
                                          )}
                                          title={column.Header}
                                          columnId={column.id}
                                        >
                                          <StyledTableSortLabel
                                            active={
                                              column.canSort && column.isSorted
                                            }
                                            direction={sortDirection}
                                            hideSortIcon={!column.canSort}
                                          >
                                            <OverflowText>
                                              {column.render('Header')}
                                            </OverflowText>
                                          </StyledTableSortLabel>
                                        </StyledTableHeadCell>
                                      );
                                    })}
                                </TableRow>
                              );
                            })}
                          </TableHead>

                          <TableBody
                            // @ts-ignore
                            component="div"
                            {...getTableBodyProps()}
                          >
                            <StyledFixedSizeList
                              ref={virtualizedListRef}
                              // The table body should take up the remaining height
                              // of the page (height) minus one row height for the
                              // TableHead and minus the horizontal scrollbar on
                              // the bottom
                              height={height - ROW_HEIGHT - scrollBarSize}
                              itemCount={rows.length}
                              itemSize={ROW_HEIGHT}
                              itemData={{
                                fullPageWidth: width,
                              }}
                              // If the width of the table is less than the full
                              // width of the page, we need to extend the width of
                              // the table and cells to match the full page's width.
                              width={
                                width > globalHeaderGroupWidth + scrollBarSize
                                  ? width
                                  : globalHeaderGroupWidth + scrollBarSize
                              }
                              // TODO: May want to find a good default value for this
                              overscanCount={1}
                              onScroll={(scrollDetails) => {
                                if (syncScrollbarRef.current) {
                                  syncScrollbarRef.current.scrollTop =
                                    scrollDetails.scrollOffset;
                                }
                              }}
                            >
                              {RenderRow}
                            </StyledFixedSizeList>
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                    );
                  }}
                </AutoSizer>
                <ScrollbarSync
                  syncScrollbarRef={syncScrollbarRef}
                  width={scrollBarSize}
                  height={(rows.length + 1) * ROW_HEIGHT + scrollBarSize}
                />
              </Box>
            </>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default ProblemReportsTable;
