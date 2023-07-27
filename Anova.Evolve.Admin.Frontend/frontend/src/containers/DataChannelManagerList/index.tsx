/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DataChannelInfoRecord,
  DataChannelListFilterOptions,
  DataChannelListGroupingOptions,
  EvolveRetrieveDataChannelInfoRecordsByOptionsRequest,
  EvolveRetrieveDataChannelInfoRecordsByOptionsResponse,
  ListSortDirection,
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
import { IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED } from 'env';
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
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import {
  selectHasPermission,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { formatSearchText } from 'utils/api/helpers';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import { formatBooleanToYesOrNoString } from '../../utils/format/boolean';
import { formatModifiedDatetime } from '../../utils/format/dates';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  DataChannelColumnId,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useDeleteDataChannels } from './hooks/useDeleteRecord';
import { useRetrieveDataChannelInfoRecords } from './hooks/useRetrieveDataChannelInfoRecords';

interface FilterByData {
  filterByColumn: DataChannelListFilterOptions;
  filterTextValue: string;
}
// todo: fix asset and rtu grouping
const enumToAccessorMap = {
  [DataChannelListGroupingOptions.None]: '',
  [DataChannelListGroupingOptions.CustomerName]: 'customerName',
  [DataChannelListGroupingOptions.Asset]: 'asset',
  [DataChannelListGroupingOptions.RTU]: 'rtu',
};
const recordsDefault: DataChannelInfoRecord[] = [];

const DataChannelManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const hasPermission = useSelector(selectHasPermission);
  const canDelete = hasPermission(
    UserPermissionType.DataChannelGlobal,
    AccessType.Delete
  );

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveDataChannelInfoRecordsByOptionsResponse | null>(
    null
  );

  // Filter by
  const [filterByColumn, setFilterByColumn] = useState(
    DataChannelListFilterOptions.Description
  );
  const [filterTextValue, setFilterTextValue] = useState('');

  // groupby
  const [groupByColumn, setGroupByColumn] = useState(
    DataChannelListGroupingOptions.CustomerName
  );
  const [groupByColumnAccessor, setGroupByColumnAccessor] = useState(
    enumToAccessorMap[groupByColumn]
  );

  // Deletion
  const deleteRecordsApi = useDeleteDataChannels();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    DataChannelInfoRecord[]
  >([]);

  const handleDeleteOne = (dataChannel: DataChannelInfoRecord) => {
    if (dataChannel.dataChannelId) {
      setRecordsToBeDeleted([dataChannel]);
      setIsDeleteDialogOpen(true);
    }
  };

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDelete
    ? []
    : [DataChannelColumnId.Selection, DataChannelColumnId.Action];

  const hiddenColumns = React.useMemo(() => hiddenPermissionColumns, [
    hiddenPermissionColumns.join(','),
  ]);

  // Pagination
  const [pageSize] = useState(50);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  const records =
    apiResponse?.retrieveDataChannelInfoRecordsByOptionsResult?.records ||
    recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, DataChannelInfoRecord>
  >({});

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description'),
        accessor: DataChannelColumnId.Description,
      },
      {
        Header: t('ui.common.customername', 'Customer Name'),
        accessor: DataChannelColumnId.CustomerName,
      },
      {
        id: DataChannelColumnId.DataChannelType,
        Header: t('ui.common.type', 'Type'),
        accessor: (row: DataChannelInfoRecord) => {
          if (row.dataChannelTypeId) {
            return dataChannelTypeTextMapping[row.dataChannelTypeId];
          }
          return '';
        },
      },

      {
        Header: t('ui.common.rtu', 'RTU'),
        accessor: DataChannelColumnId.DeviceId,
      },
      {
        Header: t('ui.datachannel.rtuchannel', 'RTU Channel'),
        accessor: DataChannelColumnId.ChannelNumber,
      },
      {
        Header: t('ui.common.product', 'Product'),
        accessor: DataChannelColumnId.ProductName,
      },
      {
        id: DataChannelColumnId.LatestReadingTime,
        Header: t('ui.datachannel.datatimestamp', 'Data Timestamp'),
        accessor: (row: DataChannelInfoRecord) => {
          if (row.latestReadingTime) {
            return formatModifiedDatetime(row.latestReadingTime);
          }
          return '';
        },
      },
      {
        Header: t('ui.common.template', 'Template'),
        accessor: DataChannelColumnId.DataChannelTemplateName,
      },
      {
        Header: t('ui.datachannel.referencecount', 'Reference Count'),
        accessor: DataChannelColumnId.ReferenceCount,
      },
      {
        id: DataChannelColumnId.IsPublished,
        Header: t('ui.datachannel.published', 'Published'),
        accessor: (row: DataChannelInfoRecord) => {
          if (row.isPublished !== undefined) {
            return formatBooleanToYesOrNoString(row.isPublished, t);
          }
          return '';
        },
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
    [t, selectedRows]
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

  const tableInstance = useTable<DataChannelInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
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
    (hooks: Hooks<DataChannelInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row?.original?.dataChannelId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.dataChannelId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'dataChannelId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: Row<DataChannelInfoRecord> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'dataChannelId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.dataChannelId!] || false}
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

  const dataChannelInfoRecordsApiOptions = {
    isCountRequired: true,
    itemsPerPage: pageSize,
    pageIndex: pageNumber,
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

  const retrieveDataChannelInfoRecordsApi = useRetrieveDataChannelInfoRecords(
    {
      options: dataChannelInfoRecordsApiOptions,
    } as EvolveRetrieveDataChannelInfoRecordsByOptionsRequest,
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
          apiData.retrieveDataChannelInfoRecordsByOptionsResult?.totalRecords ||
          0;
        setTotalRows(totalRecords);
        setPageCount(Math.ceil(totalRecords / pageSize));
        // remove this section to allow customerName to appear in table.
        // check with steven / paolo
        // if (groupBy === DataChannelListGroupingOptions.CustomerName) {
        //   setHiddenColumns([]);
        // } else {
        //   setHiddenColumns([
        //     enumToAccessorMap[DataChannelListGroupingOptions.CustomerName],
        //   ]);
        // }
      },
    }
  );

  const deleteRecords = () => {
    return deleteRecordsApi
      .mutateAsync({
        dataChannelIds: recordsToBeDeleted
          .filter((record) => record.dataChannelId)
          .map((record) => record.dataChannelId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveDataChannelInfoRecordsApi.refetch();
      })
      .catch(() => {});
  };

  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleGroupByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const column = event.target.value as DataChannelListGroupingOptions;
    setGroupByColumn(column);
    setGroupByColumnAccessor(enumToAccessorMap[column]);
  };

  const handleFilterFormSubmit = (filterData: FilterByData) => {
    setFilterByColumn(filterData.filterByColumn);
    setFilterTextValue(filterData.filterTextValue);
    setPageNumber(0);
  };

  const handleRowClick = (row: Row<DataChannelInfoRecord>) => {
    const dataChannelRoute = IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED
      ? routes.dataChannelManager.edit
      : routes.dataChannelManagerLegacy.edit;
    history.push(
      generatePath(dataChannelRoute, {
        dataChannelId: row.original.dataChannelId,
      })
    );
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const { isLoading, isError, isFetching } = retrieveDataChannelInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveDataChannelInfoRecordsApi.refetch} />
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
        isDeleting={deleteRecordsApi.isLoading}
        hasError={!!deleteRecordsApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.dataChannelId}>
                {record.dataChannelDescription}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

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
                {t('ui.datachannel.empty', 'No Data Channels found')}
              </LargeBoldDarkText>
            </MessageBlock>
          )}
        </div>
      </Fade>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        <Fade
          in={!isLoading && !isError && rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                shouldShowActions={canDelete}
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
                <GenericDataTable<DataChannelInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="data channel manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleRowClick={handleRowClick}
                  handleDeleteOne={handleDeleteOne}
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

export default DataChannelManagerList;
