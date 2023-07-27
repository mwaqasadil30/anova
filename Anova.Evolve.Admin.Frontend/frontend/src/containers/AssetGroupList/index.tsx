/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  AssetGroupInfoRecord,
  EvolveRetrieveAssetGroupInfoRecordsByDomainRequest,
  EvolveRetrieveAssetGroupInfoRecordsByDomainResponse,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Hooks,
  Row,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  AssetGroupListColumnId,
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useDeleteAssetGroups } from './hooks/useDeleteAssetGroups';
import { useRetrieveAssetGroupInfoRecords } from './hooks/useRetrieveAssetGroupInfoRecords';

const recordsDefault: AssetGroupInfoRecord[] = [];

const AssetGroupList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const domainId = useSelector(selectActiveDomainId);

  const hasPermission = useSelector(selectHasPermission);
  const canDelete = hasPermission(
    UserPermissionType.AssetGroupAccess,
    AccessType.Delete
  );

  const [selectedRows, setSelectedRows] = useState<
    Record<string, AssetGroupInfoRecord>
  >({});
  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveAssetGroupInfoRecordsByDomainResponse | null>(
    null
  );

  // Deletion
  const deleteAssetGroupsApi = useDeleteAssetGroups();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    AssetGroupInfoRecord[]
  >([]);
  const handleDeleteOne = (assetGroup: AssetGroupInfoRecord) => {
    if (assetGroup.assetGroupId) {
      setRecordsToBeDeleted([assetGroup]);
      setIsDeleteDialogOpen(true);
    }
  };
  const handleRowClick = (row: Row<AssetGroupInfoRecord>) => {
    history.push(
      generatePath(routes.assetGroupManager.edit, {
        assetGroupId: row.original.assetGroupId,
      })
    );
  };

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDelete ? [] : ['selection', 'action'];

  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records =
    apiResponse?.retrieveAssetGroupInfoRecordsByDomainResult || recordsDefault;

  const data = React.useMemo(() => [...records], [records, selectedRows]);

  const isRecordDisabledWithDomainId = useCallback(
    (record: Omit<AssetGroupInfoRecord, 'init' | 'toJSON'>) =>
      isRecordDisabled(domainId)(record),
    [domainId]
  );

  const retrieveAssetGroupInfoRecordsApi = useRetrieveAssetGroupInfoRecords(
    { domainId } as EvolveRetrieveAssetGroupInfoRecordsByDomainRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiData) => {
        // Reset selected rows to not carry over to new pages.
        setSelectedRows({});
        setApiResponse(apiData);
      },
    }
  );

  const deleteRecords = () => {
    return deleteAssetGroupsApi
      .makeRequest({
        assetGroupIds: recordsToBeDeleted
          .filter((record) => record.assetGroupId)
          .map((record) => record.assetGroupId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveAssetGroupInfoRecordsApi.refetch();
      })
      .catch(() => {});
  };
  const handleConfirmDelete = () => {
    deleteRecords();
  };
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description'),
        accessor: AssetGroupListColumnId.Description,
      },
      {
        Header: t('report.assetgrouplist.criteria', 'Criteria'),
        accessor: AssetGroupListColumnId.Criteria,
      },
      {
        Header: t('report.assetgrouplist.usercount', 'User Count'),
        accessor: AssetGroupListColumnId.UserCount,
      },
      {
        Header: t('report.assetgrouplist.display', 'Display'),
        accessor: AssetGroupListColumnId.Display,
        Cell: ({ value }: Cell<AssetGroupInfoRecord>) =>
          formatBooleanToYesOrNoString(value, t),
      },
      {
        Header: t('report.assetgrouplist.domain', 'Domain'),
        accessor: AssetGroupListColumnId.Domain,
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

  const tableInstance = useTable<AssetGroupInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        hiddenColumns,
        sortBy: [
          {
            id: 'name',
            desc: false,
          },
        ],
      },
      // Sorting
      disableMultiSort: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<AssetGroupInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                !isRecordDisabledWithDomainId(row.original) &&
                row?.original?.assetGroupId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.assetGroupId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'assetGroupId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          // row level checkbox
          Cell: ({ row }: Cell<AssetGroupInfoRecord>) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'assetGroupId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.assetGroupId!] || false}
              disabled={isRecordDisabledWithDomainId(row.original)}
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  useEffect(() => {
    retrieveAssetGroupInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveAssetGroupInfoRecordsApi.refetch]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    tableInstance.setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const { isLoading, isError, isFetching } = retrieveAssetGroupInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveAssetGroupInfoRecordsApi.refetch} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions setGlobalFilter={tableInstance.setGlobalFilter} />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteAssetGroupsApi.isFetching}
        hasError={!!deleteAssetGroupsApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.assetGroupId}>
                {record.name}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        <Fade
          in={
            !isLoading &&
            !isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t(
                      'ui.assetgroup.assetgroupmanager.empty',
                      'No asset groups found'
                    )}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>

        <Fade
          in={!isLoading && !isError && tableInstance.rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                showActions={canDelete}
                totalRows={tableInstance.rows.length}
                disableActions={!Object.values(selectedRows).some((_) => _)}
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                }}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<AssetGroupInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="asset group manager table"
                  isRecordDisabled={isRecordDisabledWithDomainId}
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

export default AssetGroupList;
