/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  EvolveRetrieveRtuInfoRecordsByOptionsRequest,
  EvolveRetrieveRtuInfoRecordsByOptionsResponse,
  ListSortDirection,
  RTUCategoryType,
  RTUInfoRecord,
  RTUListFilterOptions,
  RTUListGroupingOptions,
  UserPermissionType,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import { ReactComponent as EllipsisIcon } from 'assets/icons/ellipsis.svg';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import GenericDataTable from 'components/GenericDataTable';
import GenericPageWrapper from 'components/GenericPageWrapper';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { RTUEditorTab } from 'containers/RTUEditor/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import {
  Cell,
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
  selectCanAccessRtuEditor,
  selectHasPermission,
  selectRtuLegacyTypeDeletePermissionMapping,
  selectRtuLegacyTypeReadPermissionMapping,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { formatSearchText } from 'utils/api/helpers';
import { buildRTUCategoryTypeTextMapping } from 'utils/i18n/enum-to-text';
import { formatBooleanToYesOrNoString } from '../../utils/format/boolean';
import { formatModifiedDatetime } from '../../utils/format/dates';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordForDeleteDisabled,
  RtuManagerColumnId,
} from './helpers';
import { useDeleteRecords } from './hooks/useDeleteRecord';
import { useRetrieveRtuInfoRecords } from './hooks/useRetrieveRtuInfoRecords';

interface FilterByData {
  filterByColumn: RTUListFilterOptions;
  filterTextValue: string;
}
const enumToAccessorMap = {
  [RTUListGroupingOptions.None]: '',
  [RTUListGroupingOptions.CustomerName]: 'customerName',
};

const recordsDefault: RTUInfoRecord[] = [];

interface RTUInfoRecordRowWithRTUId
  extends Row<Omit<RTUInfoRecord, 'rtuId'> & { rtuId: string }> {}

const RTUManagerList = () => {
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const userId = useSelector(selectUserId);
  const domainId = useSelector(selectActiveDomainId);

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveRtuInfoRecordsByOptionsResponse | null>(null);

  // Permissions / Security
  const isRtuEditorFeatureEnabled = useSelector(selectCanAccessRtuEditor);
  const hasPermission = useSelector(selectHasPermission);
  const canAccessEditorByRtuCategory = useSelector(
    selectRtuLegacyTypeReadPermissionMapping
  );

  const canDeleteRtuLegacyTypeByRtuCategory = useSelector(
    selectRtuLegacyTypeDeletePermissionMapping
  );

  const canAccessAssetCopy = hasPermission(
    UserPermissionType.RTUWiredEditor,
    AccessType.Create
  );

  const canReadRtuCommsHistory = hasPermission(
    UserPermissionType.MiscellaneousFeatureRTUCommsHistory,
    AccessType.Read
  );

  const canDeleteRTU400SeriesEditor = hasPermission(
    UserPermissionType.RTU400SeriesEditor,
    AccessType.Delete
  );
  const canDeleteRTUFileEditor = hasPermission(
    UserPermissionType.RTUFileEditor,
    AccessType.Delete
  );
  const canDeleteRTUHornerEditor = hasPermission(
    UserPermissionType.RTUHornerEditor,
    AccessType.Delete
  );
  const canDeleteRTUCloverEditor = hasPermission(
    UserPermissionType.RTUCloverEditor,
    AccessType.Delete
  );
  const canDeleteRTUMetron2Editor = hasPermission(
    UserPermissionType.RTUMetron2Editor,
    AccessType.Delete
  );
  const canDeleteRTUWiredEditor = hasPermission(
    UserPermissionType.RTUWiredEditor,
    AccessType.Delete
  );
  const canDeleteRtuWirelessEditor = hasPermission(
    UserPermissionType.RtuWirelessEditor,
    AccessType.Delete
  );

  const showDeleteOption =
    canDeleteRTU400SeriesEditor ||
    canDeleteRTUFileEditor ||
    canDeleteRTUHornerEditor ||
    canDeleteRTUCloverEditor ||
    canDeleteRTUMetron2Editor ||
    canDeleteRTUWiredEditor ||
    canDeleteRtuWirelessEditor;

  const canDeleteRtu = (rtuCategory?: RTUCategoryType) => {
    if (rtuCategory) {
      return canDeleteRtuLegacyTypeByRtuCategory[rtuCategory];
    }
    return false;
  };

  // Filter by, default RTU
  const [filterByColumn, setFilterByColumn] = useState(
    RTUListFilterOptions.RTU
  );
  const [filterTextValue, setFilterTextValue] = useState('');

  // groupby, default customer name
  const [groupByColumn, setGroupByColumn] = useState(
    RTUListGroupingOptions.CustomerName
  );
  const [groupByColumnAccessor, setGroupByColumnAccessor] = useState(
    'customerName'
  );

  // Pagination
  const [pageSize] = useState(50);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  const [selectedCategories, setSelectedCategories] = useState([
    RTUCategoryType.SMS,
    RTUCategoryType.Modbus,
    RTUCategoryType.Clover,
    RTUCategoryType.File,
    RTUCategoryType.FourHundredSeries,
    RTUCategoryType.Metron2,
    RTUCategoryType.Horner,
  ]);
  const records =
    apiResponse?.retrieveRTUInfoRecordsByOptionsResult?.records ||
    recordsDefault;
  const { t } = useTranslation();
  const rtuCategoryTypeTextMapping = buildRTUCategoryTypeTextMapping(t);

  const [selectedRows, setSelectedRows] = useState<
    Record<string, RTUInfoRecord>
  >({});

  // Deletion
  const deleteRecordsApi = useDeleteRecords();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<RTUInfoRecord[]>(
    []
  );

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.customername', 'Customer Name'),
        accessor: RtuManagerColumnId.CustomerName,
      },
      {
        Header: t('ui.common.deviceid', 'Device Id'),
        accessor: RtuManagerColumnId.DeviceId,
      },
      {
        Header: t('ui.rtu.networkaddress', 'Network Address'),
        accessor: RtuManagerColumnId.DeviceNetworkAddress,
      },
      {
        Header: t('ui.common.carrier', 'Carrier'),
        accessor: RtuManagerColumnId.CarrierName,
      },

      {
        Header: t('ui.rtu.rtuchannelcount', 'RTU Channel Count'),
        accessor: RtuManagerColumnId.RtuChannelCount,
      },
      {
        Header: t('ui.common.datachannelcount', 'Data Channel Count'),
        accessor: RtuManagerColumnId.DataChannelCount,
      },
      {
        Header: t('ui.common.siteinformation', 'Site Information'),
        accessor: RtuManagerColumnId.SiteTitle,
      },
      {
        id: 'latestPacketTimeStamp',
        Header: t('ui.rtu.lastcommdate', 'Last Comm Date'),
        accessor: (row: RTUInfoRecord) => {
          if (row.latestPacketTimeStamp) {
            return formatModifiedDatetime(row.latestPacketTimeStamp);
          }
          return '';
        },
      },

      {
        id: RtuManagerColumnId.IsSyncFailure,
        Header: t('ui.rtu.syncfailure', 'Sync Failure'),
        accessor: (row: RTUInfoRecord) => {
          if (row.isSyncFailure !== undefined) {
            return formatBooleanToYesOrNoString(row.isSyncFailure, t);
          }
          return '';
        },
      },

      {
        Header: t('ui.rtu.syncstatus', 'Sync Status'),
        accessor: RtuManagerColumnId.IsInSync,
        Cell: ({ value }: Cell<RTUInfoRecord>) =>
          formatBooleanToYesOrNoString(value, t),
      },

      {
        id: RtuManagerColumnId.Category,
        Header: t('ui.rtu.category', 'Category'),
        accessor: (row: RTUInfoRecord) => {
          if (row.category) {
            return rtuCategoryTypeTextMapping[row.category];
          }
          return '';
        },
      },
      {
        id: RtuManagerColumnId.IsPollable,
        Header: t('ui.rtu.pollable', 'Pollable'),
        accessor: 'isPollable',
        Cell: ({ value }: Cell<RTUInfoRecord>) =>
          formatBooleanToYesOrNoString(value, t),
      },
      {
        id: RtuManagerColumnId.Action,
        Header: '',
        accessor: '_',
        defaultCanSort: false,
        disableSortBy: true,
        Cell: ({ row }: { row: Row<RTUInfoRecord> }) => {
          const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
            null
          );

          const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => {
            setAnchorEl(null);
          };

          const handleDelete = () => {
            if (row.original.rtuId) {
              setRecordsToBeDeleted([row.original]);
              setIsDeleteDialogOpen(true);
            }
            handleClose();
          };

          return (
            <>
              <Button
                aria-controls="rtu options"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ width: 50, minWidth: 0, borderRadius: 0, height: 50 }}
              >
                <EllipsisIcon />
              </Button>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {/* 
                  TODO: 
                  Uncomment once the feature is implemented. 
                  Will need to update disable logic once more options are
                  available.
                */}
                {/* <MenuItem
                  onClick={handleClose}
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.swap', 'Swap')}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.copy', 'Copy')}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.transfer', 'Transfer')}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.createtemplate', 'Create Template')}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.applytemplate', 'Apply Template')}
                </MenuItem> */}
                <MenuItem
                  onClick={handleDelete}
                  // TODO: Will need to update disable logic once more options
                  // are available.
                  disabled={isRecordForDeleteDisabled(
                    row.values as RTUInfoRecord
                  )}
                >
                  {t('ui.common.delete', 'Delete')}
                </MenuItem>
              </Menu>
            </>
          );
        },
      },
    ],
    [t, selectedCategories]
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

  // TODO: Update `tableActionColumns` based off other action options (i.e. copy,
  // transfer, etc.) once those features are implemented.
  const tableActionColumns = showDeleteOption ? [] : ['action', 'selection'];
  const hiddenColumns =
    groupByColumn === RTUListGroupingOptions.CustomerName
      ? []
      : ['customerName'];

  const formattedHiddenColumns = tableActionColumns.concat(hiddenColumns);

  const tableInstance = useTable<RTUInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        // sortby default
        sortBy: [
          {
            id: 'deviceId',
            desc: false,
          },
        ],
        // Pagination
        pageSize,
        pageIndex: pageNumber,
        // groupby
        groupBy: [groupByColumnAccessor],
        expanded: expandedRows,
        hiddenColumns: formattedHiddenColumns,
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
    (hooks: Hooks<RTUInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                row.original?.rtuId &&
                canDeleteRtu(row.original.category) &&
                !isRecordForDeleteDisabled(row.values as RTUInfoRecord)
            ) as RTUInfoRecordRowWithRTUId[];
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every((row) => selectedRows[row.original.rtuId]);
            return (
              <TableCellCheckbox
                onChange={() => {
                  if (areAllRowsSelected) {
                    setSelectedRows({});
                  } else {
                    setSelectedRows(
                      selectableRows.reduce<Record<string, RTUInfoRecord>>(
                        (mem, row) => {
                          mem[row.original.rtuId!] = row.original;
                          return mem;
                        },
                        {}
                      )
                    );
                  }
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length || !showDeleteOption}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: RTUInfoRecordRowWithRTUId }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = { ...prevSelectedRows };

                  const isChecked = newSelectedRows[row.original.rtuId!];
                  if (isChecked) {
                    delete newSelectedRows[row.original.rtuId!];
                  } else {
                    newSelectedRows[row.original.rtuId!] = row.original;
                  }
                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.rtuId!] || false}
              disabled={
                // TODO: This will need to be updated once other 'actions' are
                // implemented (i.e. Swap, Transfer).
                !canDeleteRtu(row.original.category) ||
                isRecordForDeleteDisabled(row.values as RTUInfoRecord)
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

  // TODO: Permission and user-related logic needs to be cleaned up here because
  // we changed how these inherently work since this page was last worked on.

  // swap conditions
  // RTUWiredEditor(145), RTUMetron2Editor (185), RtuWirelessEditor (144), RTU400SeriesEditor(222)
  // can simulate with permission type == 2,111,113,114. Our account doesnt have the required rule conditions.

  // create array with permission objects for swap editor. then check isCreateEnabled for corresponding category and editor
  // const swapPermissions = userPermissions?.filter((result) => {
  //   return (
  //     result.permissionType === 145 ||
  //     result.permissionType === 185 ||
  //     result.permissionType === 144 ||
  //     result.permissionType === 222
  //   );
  // });

  // transfer Permissions
  // MiscellaneousFeatureRTUTransfer (166)
  // isEnabled == true to allow for transfers
  // const disableTransfer = userPermissions?.find((o) => o.permissionType === 166)
  //   ?.isEnabled;

  const {
    rows,
    state: { sortBy },
  } = tableInstance;

  const sortByColumnId = sortBy?.[0]?.id;
  const sortByColumnDirection = sortBy?.[0]?.desc;

  const rtuInfoRecordsApiOptions = {
    isCountRequired: true,
    userId,
    domainId,
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
    groupBy: groupByColumn,
    selectedRtuCategories: selectedCategories,
  };

  const retrieveRtuInfoRecordsApi = useRetrieveRtuInfoRecords(
    {
      options: rtuInfoRecordsApiOptions,
    } as EvolveRetrieveRtuInfoRecordsByOptionsRequest,
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
          apiData.retrieveRTUInfoRecordsByOptionsResult?.totalRecords || 0;
        setTotalRows(totalRecords);
        setPageCount(Math.ceil(totalRecords / pageSize));
      },
    }
  );

  const deleteRecords = () => {
    return deleteRecordsApi
      .makeRequest({
        rtuIds: recordsToBeDeleted
          .filter((record) => record.rtuId)
          .map((record) => record.rtuId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveRtuInfoRecordsApi.refetch();
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
    retrieveRtuInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveRtuInfoRecordsApi.refetch]);

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleCategoryChange = (categories: RTUCategoryType[]) => {
    setSelectedCategories(categories);
    setPageNumber(0);
  };
  const handleGroupByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const column = event.target.value as RTUListGroupingOptions;
    setPageNumber(0);
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

  const getRtuTabName = (rtuCategory: RTUCategoryType) => {
    if (rtuCategory === RTUCategoryType.Horner) {
      return RTUEditorTab.TransactionDetails;
    }

    return RTUEditorTab.PacketsAndCallHistory;
  };

  const handleRowClick = (row: Row<RTUInfoRecord>) => {
    // NOTE: Any new RTU category that needs access to the editor needs
    // to be added in the list below.
    const doesRtuCategoryHaveEditorAccess = [
      RTUCategoryType.FourHundredSeries,
      RTUCategoryType.Modbus,
      RTUCategoryType.SMS,
      RTUCategoryType.File,
      RTUCategoryType.Metron2,
      RTUCategoryType.Horner,
    ].includes(row.original.category!);

    if (
      row.original.deviceId &&
      row.original.category &&
      isRtuEditorFeatureEnabled &&
      doesRtuCategoryHaveEditorAccess &&
      canReadRtuCommsHistory &&
      canAccessEditorByRtuCategory[row.original.category]
    ) {
      history.push(
        generatePath(routes.rtuManager.edit, {
          rtuDeviceId: row.original.deviceId,
          tabName: getRtuTabName(row.original.category!),
        })
      );
    }
  };

  const handleDeleteOne = (rtu: RTUInfoRecord) => {
    if (rtu.rtuId) {
      setRecordsToBeDeleted([rtu]);
      setIsDeleteDialogOpen(true);
    }
  };

  const { isLoading, isError, isFetching } = retrieveRtuInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveRtuInfoRecordsApi.refetch} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions
          handleFilterFormSubmit={handleFilterFormSubmit}
          handleGroupByColumnChange={handleGroupByColumnChange}
          groupByColumn={groupByColumn}
          handleCategoriesChange={handleCategoryChange}
        />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteRecordsApi.isFetching}
        hasError={!!deleteRecordsApi.error}
        recordCount={recordsToBeDeleted.length || 0}
      >
        {!recordsToBeDeleted.length ? (
          <Typography>{t('ui.rtu.empty', 'No RTUs found')}</Typography>
        ) : (
          <ul>
            {recordsToBeDeleted.map((record) => (
              <li key={record.rtuId}>
                <Typography>{record.deviceId}</Typography>
              </li>
            ))}
          </ul>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

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
                  {t('ui.rtu.rtumanager.empty', 'No RTUs found')}
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
                // shouldShowActions needs to be updated with each individual
                // dropdown option permission eventually once those features
                // are implemented.
                shouldShowActions={showDeleteOption}
                shouldDisableActions={
                  !Object.values(selectedRows).some((_) => _)
                }
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                  // route for business logic
                  copySelected: () => {
                    const filteredRowIds = Object.keys(selectedRows).filter(
                      (rowId) => selectedRows[rowId]
                    );

                    if (filteredRowIds.length === 1) {
                      const copyAssetRoutePath = generatePath(
                        routes.assetManager.copy,
                        {
                          assetId: filteredRowIds[0],
                        }
                      );

                      history.push(copyAssetRoutePath);
                    }
                  },
                  // TODO: Eventually check permissions for items below.
                  // Also needs to take into account RTUCategory.
                  isCopyDisabled: canAccessAssetCopy,
                  isApplyTemplateDisabled: true,
                  isSwapDisabled: true,
                  isTransferDisabled: true,
                  isCreateTemplateDisabled: true,
                  isDeleteDisabled: !showDeleteOption,
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
                <GenericDataTable<RTUInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="rtu manager table"
                  isRecordDisabled={isRecordForDeleteDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  // Rtu editor needs to be implemented in order to use
                  // function below and redirect user to it
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

export default RTUManagerList;
