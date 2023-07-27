/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsRequest,
  EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsResponse,
  ListSortDirection,
  RTUPollScheduleGroupFilterOptions,
  RtuPollScheduleGroupInfoRecord,
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
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import {
  Cell,
  Hooks,
  Row,
  useExpanded,
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
import { buildPollScheduleTypeMapping } from 'utils/i18n/enum-to-text';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import NameCell from './components/NameCell';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useDeletePollSchedules } from './hooks/useDeletePollSchedules';
import { useRetrieveRtuPollScheduleGroupRecords } from './hooks/useRetrieveRtuPollScheduleGroupRecords';

interface FilterByData {
  filterByColumn: RTUPollScheduleGroupFilterOptions;
  filterTextValue: string;
}

const recordsDefault: RtuPollScheduleGroupInfoRecord[] = [];

const RTUPollScheduleManagerList = () => {
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);
  const hasPermission = useSelector(selectHasPermission);
  const canDelete = hasPermission(
    UserPermissionType.RTUPollSchedule,
    AccessType.Delete
  );

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsResponse | null>(
    null
  );
  // Filter by
  const [filterByColumn, setFilterByColumn] = useState(
    RTUPollScheduleGroupFilterOptions.Name
  );
  const [filterTextValue, setFilterTextValue] = useState('');

  // Pagination
  const [pageSize] = useState(50);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  // Deletion
  const deleteRecordsApi = useDeletePollSchedules();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    RtuPollScheduleGroupInfoRecord[]
  >([]);

  const handleDeleteOne = (pollSchedule: RtuPollScheduleGroupInfoRecord) => {
    if (pollSchedule.rtuPollScheduleGroupId) {
      setRecordsToBeDeleted([pollSchedule]);
      setIsDeleteDialogOpen(true);
    }
  };

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDelete ? [] : ['selection', 'action'];

  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records =
    apiResponse?.retrieveRTUPollScheduleGroupRecordsByOptionsResult?.records ||
    recordsDefault;
  const [selectedRows, setSelectedRows] = useState<
    Record<string, RtuPollScheduleGroupInfoRecord>
  >({});

  const { t } = useTranslation();

  const pollScheduleTypeTextMapping = buildPollScheduleTypeMapping(t);

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () =>
      [
        {
          accessor: 'name',
          Header: t('ui.common.name', 'Name'),
          Cell: NameCell,
        },
        {
          id: 'typeOfSchedule',
          Header: t('ui.common.type', 'Type'),
          accessor: (row: RtuPollScheduleGroupInfoRecord) => {
            if (row.typeOfSchedule) {
              return pollScheduleTypeTextMapping[row.typeOfSchedule];
            }
            return '';
          },
        },
        { accessor: 'rtuCount', Header: t('ui.site.rtucount', 'RTU Count') },
        {
          accessor: 'totalPolls',
          Header: t('ui.rtu.totalpolls', 'Total Polls'),
        },
        {
          id: 'action',
          Header: '',
          accessor: '_',
          defaultCanSort: false,
          disableSortBy: true,
          Cell: TableActionCell,
        },
      ] as {
        accessor: keyof RtuPollScheduleGroupInfoRecord;
        Header: string;
      }[],
    [t, selectedRows]
  );

  const tableInstance = useTable<RtuPollScheduleGroupInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        // Pagination
        pageSize,
        pageIndex: pageNumber,
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
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks: Hooks<RtuPollScheduleGroupInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row?.original?.rtuPollScheduleGroupId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.rtuPollScheduleGroupId!]
              );

            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'rtuPollScheduleGroupId'
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
          // real type is Row<RtuPollScheduleGroupInfoRecord>
          Cell: ({ row }: Cell<RtuPollScheduleGroupInfoRecord>) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'rtuPollScheduleGroupId'
                  );

                  return newSelectedRows;
                })
              }
              checked={
                !!selectedRows[row.original.rtuPollScheduleGroupId!] || false
              }
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

  const rtuPollScheduleGroupRecordsApiOptions = {
    isCountRequired: true,
    pageIndex: pageNumber,
    itemsPerPage: pageSize,
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

  const rtuPollScheduleGroupRecordsApi = useRetrieveRtuPollScheduleGroupRecords(
    {
      options: rtuPollScheduleGroupRecordsApiOptions,
    } as EvolveRetrieveRtuPollScheduleGroupRecordsByOptionsRequest,
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
          apiData.retrieveRTUPollScheduleGroupRecordsByOptionsResult
            ?.totalRecords || 0;
        setTotalRows(totalRecords);
        setPageCount(Math.ceil(totalRecords / pageSize));
        // remove this section to allow customerName to appear in table.
        // check with steven / paolo (MM/DD/2020)
        // if (groupBy === RTUPollScheduleGroupGroupingOptions.CustomerName) {
        //   setHiddenColumns([]);
        // } else {
        //   setHiddenColumns([
        //     enumToAccessorMap[RTUPollScheduleGroupGroupingOptions.CustomerName],
        //   ]);
        // }
      },
    }
  );

  const refetchRecords = rtuPollScheduleGroupRecordsApi.refetch;

  const deleteRecords = () => {
    return deleteRecordsApi
      .mutateAsync({
        rtuPollScheduleGroupIds: recordsToBeDeleted
          .filter((record) => record.rtuPollScheduleGroupId)
          .map((record) => record.rtuPollScheduleGroupId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void refetchRecords();
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
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    tableInstance.setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
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

  const handleRowClick = (row: Row<RtuPollScheduleGroupInfoRecord>) => {
    history.push(
      generatePath(routes.pollScheduleManager.edit, {
        pollScheduleId: row.original.rtuPollScheduleGroupId,
      })
    );
  };

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const { isLoading, isError, isFetching } = rtuPollScheduleGroupRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={refetchRecords} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions handleFilterFormSubmit={handleFilterFormSubmit} />
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
              <DeleteListItem key={record.rtuPollScheduleGroupId}>
                {record.name}
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
                {t('ui.rtu.empty', 'No Poll Schedules found')}
              </LargeBoldDarkText>
            </MessageBlock>
          )}
        </div>
      </Fade>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        <Fade
          in={!isLoading && !isError && tableInstance.rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                totalRows={totalRows}
                pageIndex={pageNumber}
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
                pageSize={pageSize}
                align="center"
                items={items}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<RtuPollScheduleGroupInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="poll schedule manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleRowClick={handleRowClick}
                  handleDeleteOne={handleDeleteOne}
                  minWidth={768}
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

export default RTUPollScheduleManagerList;
