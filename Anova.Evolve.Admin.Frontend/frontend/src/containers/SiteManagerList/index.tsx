/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  EvolveRetrieveSiteInfoRecordsByOptionsRequest,
  EvolveRetrieveSiteInfoRecordsByOptionsResponse,
  ListSortDirection,
  SiteInfoRecord,
  SiteListFilterOptions,
  SiteListGroupingOptions,
  UserPermissionType,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import {
  DeleteListItem,
  DeleteUnorderedList,
} from 'components/DeletionWarningDialog/styles';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import GenericDataTable from 'components/GenericDataTable';
import GenericPageWrapper from 'components/GenericPageWrapper';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import TableActionCell from 'components/TableActionCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import uniq from 'lodash/uniq';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Hooks,
  Row,
  useExpanded,
  useGroupBy,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  selectActiveDomainId,
  selectIsActiveDomainApciEnabled,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import {
  selectHasPermission,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { formatSearchText } from 'utils/api/helpers';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import LabelledCell from './components/LabelledCell';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  SiteListColumnId,
} from './helpers';
import { useDeleteSites } from './hooks/useDeleteSites';
import { useRetrieveSiteInfoRecords } from './hooks/useRetrieveSiteInfoRecords';

const enumToAccessorMap = {
  [SiteListGroupingOptions.None]: '',
  [SiteListGroupingOptions.CustomerName]: 'customerName',
  [SiteListGroupingOptions.State]: 'state',
  [SiteListGroupingOptions.Country]: 'country',
};
const recordsDefault: SiteInfoRecord[] = [];

interface FilterByData {
  filterByColumn: SiteListFilterOptions;
  filterTextValue: string;
}

const SiteManagerList = () => {
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const hasPermission = useSelector(selectHasPermission);
  const canDeleteSite = hasPermission(
    UserPermissionType.SiteGlobal,
    AccessType.Delete
  );

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveSiteInfoRecordsByOptionsResponse | null>(null);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  // Filter by
  const [filterByColumn, setFilterByColumn] = useState(
    SiteListFilterOptions.CustomerName
  );
  const [filterTextValue, setFilterTextValue] = useState('');

  // groupby
  const [groupByColumn, setGroupByColumn] = useState(
    SiteListGroupingOptions.CustomerName
  );
  const [groupByColumnAccessor, setGroupByColumnAccessor] = useState(
    'customerName'
  );

  // Pagination
  const [pageSize] = useState(50);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDeleteSite ? [] : ['selection', 'action'];
  const hiddenAirProductsColumns = isAirProductsEnabledDomain
    ? ['selection', 'action']
    : ['siteNumber'];

  const hiddenColumns = React.useMemo(
    () => uniq([...hiddenPermissionColumns, ...hiddenAirProductsColumns]),
    // Could there be a clash with Air products and permission related hidden columns
    // i.e. 'selection' and 'action'?
    [hiddenPermissionColumns.join(','), hiddenAirProductsColumns.join(',')]
  );

  const records =
    apiResponse?.retrieveSiteInfoRecordsByOptionsResult?.records ||
    recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, SiteInfoRecord>
  >({});

  // Deletion
  const deleteSitesApi = useDeleteSites();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    SiteInfoRecord[]
  >([]);
  const handleDeleteOne = (site: SiteInfoRecord) => {
    if (site.siteId) {
      setRecordsToBeDeleted([site]);
      setIsDeleteDialogOpen(true);
    }
  };

  const { t } = useTranslation();
  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.customername', 'Customer Name'),
        accessor: SiteListColumnId.CustomerName,
      },
      {
        Header: t('ui.site.siteNumber', 'Site Number'),
        accessor: SiteListColumnId.SiteNumber,
        sortType: 'number',
      },
      {
        Header: t('ui.common.city', 'City'),
        accessor: SiteListColumnId.City,
      },
      {
        Header: t('ui.common.state', 'State'),
        accessor: SiteListColumnId.State,
        Cell: LabelledCell,
      },

      {
        Header: t('ui.common.country', 'Country'),
        accessor: SiteListColumnId.Country,
        Cell: LabelledCell,
      },
      {
        Header: t('ui.site.assetcount', 'Asset Count'),
        accessor: SiteListColumnId.AssetCount,
      },
      {
        Header: t('ui.site.rtucount', 'RTU Count'),
        accessor: SiteListColumnId.RtuCount,
      },

      {
        Header: t('ui.common.timezone', 'Time Zone'),
        accessor: SiteListColumnId.TimeZoneName,
      },
      {
        id: 'action',
        Header: '',
        accessor: '_',
        defaultCanSort: false,
        disableSortBy: true,
        Cell: TableActionCell,
      },
    ],
    [t]
  );

  const expandedRows = React.useMemo(
    () =>
      records.reduce((prev, current) => {
        /* eslint-disable-next-line no-param-reassign */
        prev[
          // @ts-ignore
          `${groupByColumnAccessor}:${current[groupByColumnAccessor]}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [records, groupByColumnAccessor]
  );

  const tableInstance = useTable<SiteInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        // sortby default
        sortBy: [
          {
            id: 'city',
            desc: false,
          },
        ],
        // Pagination
        pageSize,
        pageIndex: pageNumber,
        // groupby
        groupBy: [groupByColumnAccessor],
        expanded: expandedRows,
        hiddenColumns,
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
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: Hooks<SiteInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                row.original?.siteId &&
                !isRecordDisabled(row.values as SiteInfoRecord)
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every((row) => selectedRows[row.original.siteId!]);
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'siteId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          // this is a cheesy way to override type here, but I'm doing it for cleanness
          // real type is Row<SiteInfoRecord>
          Cell: ({ row }: { row: Row<SiteInfoRecord> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'siteId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.siteId!] || false}
              disabled={isRecordDisabled(row.values as SiteInfoRecord)}
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );
  const {
    rows,
    state: { sortBy },
    setHiddenColumns,
  } = tableInstance;

  const sortByColumnId = sortBy?.[0]?.id;
  const sortByColumnDirection = sortBy?.[0]?.desc;

  const siteInfoRecordsApiOptions = {
    isCountRequired: true,
    pageIndex: pageNumber,
    itemsPerPage: pageSize,
    groupBy: groupByColumn,
    filterText: formatSearchText(filterTextValue, {
      addWildcardAsterisks: true,
    }),
    filterBy: filterByColumn,
    sortColumnName: sortByColumnId,
    sortDirection: sortByColumnDirection
      ? ListSortDirection.Descending
      : ListSortDirection.Ascending,
    domainId,
    userId,
  };

  const retrieveSiteInfoRecordsApi = useRetrieveSiteInfoRecords(
    {
      options: siteInfoRecordsApiOptions,
    } as EvolveRetrieveSiteInfoRecordsByOptionsRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiData) => {
        // Reset selected rows to not carry over to new pages.
        setSelectedRows({});
        setApiResponse(apiData);
        const totalRecords =
          apiData.retrieveSiteInfoRecordsByOptionsResult?.totalRecords || 0;
        setTotalRows(totalRecords);
        setPageCount(Math.ceil(totalRecords / pageSize));
      },
    }
  );

  const deleteRecords = () => {
    return deleteSitesApi
      .makeRequest({
        siteIds: recordsToBeDeleted
          .filter((record) => record.siteId)
          .map((record) => record.siteId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveSiteInfoRecordsApi.refetch();
      })
      .catch(() => {});
  };
  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    retrieveSiteInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveSiteInfoRecordsApi.refetch]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleGroupByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const column = event.target.value as SiteListGroupingOptions;
    setGroupByColumn(column);
    setGroupByColumnAccessor(enumToAccessorMap[column]);
  };

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setFilterByColumn(filterData.filterByColumn);
    setFilterTextValue(filterData.filterTextValue);
    setPageNumber(0);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  const handleRowClick = (row: Row<SiteInfoRecord>) => {
    history.push(
      generatePath(routes.siteManager.edit, {
        siteId: row.original.siteId,
      })
    );
  };

  const { isLoading, isError, isFetching } = retrieveSiteInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro
          isAirProductsEnabledDomain={isAirProductsEnabledDomain}
          refetchRecords={retrieveSiteInfoRecordsApi.refetch}
        />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions
          handleFilterFormSubmit={handleFilterFormSubmit}
          handleGroupByColumnChange={handleGroupByColumnChange}
          groupByColumn={groupByColumn}
        />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteSitesApi.isFetching}
        hasError={!!deleteSitesApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.siteId}>
                {record.customerName}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        {/* No Records found */}
        <Fade
          in={!isLoading && !isError && !isFetching && rows.length === 0}
          unmountOnExit
        >
          <div>
            {!isLoading && !isError && !isFetching && rows.length === 0 && (
              <MessageBlock>
                <Box m={2}>
                  <SearchCloudIcon />
                </Box>
                <LargeBoldDarkText>
                  {t('ui.site.sitemanager.empty', 'No sites found')}
                </LargeBoldDarkText>
              </MessageBlock>
            )}
          </div>
        </Fade>

        <Fade
          in={!isLoading && !isError && rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                shouldShowActions={canDeleteSite && !isAirProductsEnabledDomain}
                shouldDisableActions={
                  !Object.values(selectedRows).some((_) => _)
                }
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                }}
                totalRows={totalRows}
                pageIndex={pageNumber}
                pageSize={pageSize}
                align="center"
                items={items}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<SiteInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="site manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  handleRowClick={handleRowClick}
                  TableProps={{ stickyHeader: true }}
                  TableContainerProps={{
                    style: {
                      maxHeight: '100%',
                    },
                  }}
                />
              </DarkFadeOverlay>
            </Box>
          </Box>
        </Fade>
      </BoxWithOverflowHidden>
    </GenericPageWrapper>
  );
};

export default SiteManagerList;
