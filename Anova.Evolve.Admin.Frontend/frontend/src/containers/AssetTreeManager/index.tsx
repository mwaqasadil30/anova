/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  AssetTreeInfoRecord,
  EvolveRetrieveAssetTreeInfoRecordsByDomainRequest,
  EvolveRetrieveAssetTreeInfoRecordsByDomainResponse,
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
import { Hooks, Row, useRowSelect, useSortBy, useTable } from 'react-table';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import { useDeleteAssetTrees } from './components/hooks/useDeleteAssetTrees';
import { useRetrieveAssetTreeInfoRecords } from './components/hooks/useRetrieveAssetTreeInfoRecords';
import NameCell from './components/NameCell';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import {
  AssetTreeListColumnId,
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';

const recordsDefault: AssetTreeInfoRecord[] = [];

const AssetTreeList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const domainId = useSelector(selectActiveDomainId);

  const hasPermission = useSelector(selectHasPermission);
  const canDelete = hasPermission(
    UserPermissionType.AssetTreeAccess,
    AccessType.Delete
  );

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveAssetTreeInfoRecordsByDomainResponse | null>(null);

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDelete ? [] : ['selection', 'action'];

  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records =
    apiResponse?.retrieveAssetTreeInfoRecordsByDomainResult || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, AssetTreeInfoRecord>
  >({});

  // Deletion
  const deleteAssetTreesApi = useDeleteAssetTrees();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    AssetTreeInfoRecord[]
  >([]);
  const handleDeleteOne = (assetTree: AssetTreeInfoRecord) => {
    if (assetTree.assetTreeId) {
      setRecordsToBeDeleted([assetTree]);
      setIsDeleteDialogOpen(true);
    }
  };

  const data = React.useMemo(() => records, [records, selectedRows]);
  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description'),
        accessor: AssetTreeListColumnId.Description,
        Cell: NameCell,
      },
      {
        Header: t('ui.assettree.treeExpression', 'Tree Expression'),
        accessor: AssetTreeListColumnId.TreeExpression,
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
    // We need to add selectedRows here to update the checkbox column because
    // react table only renders once and will not change / re-render unless
    // it is added in the dependencies below
    // See: https://stackoverflow.com/questions/66784663/react-table-data-flow-between-outside-and-inside-of-hooks-visiblecolumns-push-in
    [t, selectedRows]
  );

  const tableInstance = useTable<AssetTreeInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        sortBy: [
          {
            id: 'name',
            desc: false,
          },
        ],
        hiddenColumns,
      },
      // Sorting
      disableMultiSort: true,
    },
    useSortBy,
    useRowSelect,
    (hooks: Hooks<AssetTreeInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original?.assetTreeId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.assetTreeId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'assetTreeId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: Row<AssetTreeInfoRecord> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'assetTreeId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.assetTreeId!] || false}
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const { rows, setHiddenColumns } = tableInstance;

  const retrieveAssetTreeInfoRecordsApi = useRetrieveAssetTreeInfoRecords(
    { domainId } as EvolveRetrieveAssetTreeInfoRecordsByDomainRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiDate) => {
        setApiResponse(apiDate);
      },
    }
  );

  const deleteRecords = () => {
    return deleteAssetTreesApi
      .makeRequest({
        assetTreeIds: recordsToBeDeleted
          .filter((record) => record.assetTreeId)
          .map((record) => record.assetTreeId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveAssetTreeInfoRecordsApi.refetch();
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
    retrieveAssetTreeInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveAssetTreeInfoRecordsApi.refetch]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const handleRowClick = (row: Row<AssetTreeInfoRecord>) => {
    history.push(
      generatePath(routes.assetTreeManager.edit, {
        assetTreeId: row.original.assetTreeId,
      })
    );
  };

  const { isLoading, isError, isFetching } = retrieveAssetTreeInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveAssetTreeInfoRecordsApi.refetch} />
      </PageIntroWrapper>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteAssetTreesApi.isFetching}
        hasError={!!deleteAssetTreesApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.assetTreeId}>
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
                  {t('ui.assettree.AssetTree.empty', 'No asset trees found')}
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
                totalRows={rows.length}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isLoading} height="100%">
                <GenericDataTable<AssetTreeInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="asset tree manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  handleRowClick={handleRowClick}
                  minWidth={650}
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

export default AssetTreeList;
