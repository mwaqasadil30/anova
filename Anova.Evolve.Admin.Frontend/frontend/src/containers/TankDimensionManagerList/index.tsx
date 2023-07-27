/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  EvolveRetrieveTankDimensionInfoRecordsByDomainRequest,
  EvolveRetrieveTankDimensionInfoRecordsByDomainResponse,
  TankDimensionInfoRecord,
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
import LabelledCell from 'components/tables/components/LabelledCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useEffect, useState } from 'react';
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
import {
  buildTankTypeTextMapping,
  buildUnitsOfMeasureTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  TankDimensionsListColumnId,
} from './helpers';
import { useDeleteTankDimensions } from './hooks/useDeleteTankDimensions';
import { useRetrieveTankDimensionInfoRecords } from './hooks/useRetrieveTankDimensionInfoRecords';

const recordsDefault: TankDimensionInfoRecord[] = [];

const TankDimensionManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const domainId = useSelector(selectActiveDomainId);

  const tankTypeTextMapping = buildTankTypeTextMapping(t);
  const unitTypeTextMapping = buildUnitsOfMeasureTextMapping(t);

  const hasPermission = useSelector(selectHasPermission);
  const canDeleteTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Delete
  );

  const [selectedRows, setSelectedRows] = useState<
    Record<string, TankDimensionInfoRecord>
  >({});

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveTankDimensionInfoRecordsByDomainResponse | null>(
    null
  );

  // Deletion
  const deleteTankDimensionsApi = useDeleteTankDimensions();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    TankDimensionInfoRecord[]
  >([]);
  const handleDeleteOne = (tankDimension: TankDimensionInfoRecord) => {
    if (tankDimension.tankDimensionId) {
      setRecordsToBeDeleted([tankDimension]);
      setIsDeleteDialogOpen(true);
    }
  };
  const handleRowClick = (row: Row<TankDimensionInfoRecord>) => {
    history.push(
      generatePath(routes.tankDimensionManager.edit, {
        tankDimensionId: row.original.tankDimensionId,
      })
    );
  };

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDeleteTankDimension
    ? []
    : ['selection', 'action'];

  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records =
    apiResponse?.retrieveTankDimensionInfoRecordsByDomainResult ||
    recordsDefault;
  const data = React.useMemo(() => [...records], [records]);

  const columns = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description'),
        accessor: TankDimensionsListColumnId.Description,
      },
      {
        id: TankDimensionsListColumnId.Type,
        Header: t('ui.common.type', 'Type'),
        accessor: (tankDimension: TankDimensionInfoRecord) =>
          // @ts-ignore
          tankTypeTextMapping[tankDimension.type],
        disableGlobalFilter: true,
      },
      {
        Header: t('ui.tankdimension.width', 'Width'),
        accessor: TankDimensionsListColumnId.Width,
        sortType: 'basic',
        disableGlobalFilter: true,
      },
      {
        Header: t('ui.tankdimension.height', 'Height'),
        accessor: TankDimensionsListColumnId.Height,
        sortType: 'basic',
        disableGlobalFilter: true,
      },
      {
        Header: t('ui.tankdimension.dishheight', 'Dish Height'),
        accessor: TankDimensionsListColumnId.DishHeight,
        sortType: 'basic',
        disableGlobalFilter: true,
      },
      {
        id: TankDimensionsListColumnId.UnitsOfMeasure,
        Header: t('ui.tankdimension.unitsofmeasure', 'Units Of Measure'),
        accessor: (tankDimension: TankDimensionInfoRecord) =>
          // @ts-ignore
          unitTypeTextMapping[tankDimension.units],
        disableGlobalFilter: true,
      },
      {
        Header: t('ui.common.datachannelcount', 'Data Channel Count'),
        accessor: TankDimensionsListColumnId.DataChannelCount,
        sortType: 'basic',
        disableGlobalFilter: true,
        Cell: (props: Cell<TankDimensionInfoRecord>) => (
          <LabelledCell aria-label="Data channel count" {...props} />
        ),
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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [t, selectedRows]
  );

  const tableInstance = useTable<TankDimensionInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      disableMultiSort: true,
      initialState: {
        hiddenColumns,
      },
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<TankDimensionInfoRecord>) => {
      // Set up the left-most checkbox selection column
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                !isRecordDisabled(row.values as TankDimensionInfoRecord) &&
                row?.original?.tankDimensionId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.tankDimensionId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'tankDimensionId'
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
          Cell: ({ row }: Cell<TankDimensionInfoRecord>) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'tankDimensionId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.tankDimensionId!] || false}
              disabled={isRecordDisabled(row.values as TankDimensionInfoRecord)}
            />
          ),
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const retrieveTankDimensionInfoRecordsApi = useRetrieveTankDimensionInfoRecords(
    {
      domainId,
    } as EvolveRetrieveTankDimensionInfoRecordsByDomainRequest,
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
    return deleteTankDimensionsApi
      .makeRequest({
        tankDimensionIds: recordsToBeDeleted
          .filter((record) => record.tankDimensionId)
          .map((record) => record.tankDimensionId!),
      })
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
        return void retrieveTankDimensionInfoRecordsApi.refetch();
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
    retrieveTankDimensionInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveTankDimensionInfoRecordsApi.refetch]);

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    tableInstance.setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  const {
    isLoading,
    isError,
    isFetching,
  } = retrieveTankDimensionInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro
          refetchRecords={retrieveTankDimensionInfoRecordsApi.refetch}
        />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions setGlobalFilter={tableInstance.setGlobalFilter} />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteTankDimensionsApi.isFetching}
        hasError={!!deleteTankDimensionsApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.tankDimensionId}>
                {record.description}
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
                      'ui.tankdimension.list.empty',
                      'No tank dimensions found'
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
                showActions={canDeleteTankDimension}
                disableActions={!Object.values(selectedRows).some((_) => _)}
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                }}
                totalRows={tableInstance.rows.length}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<TankDimensionInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="tank dimension manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  handleRowClick={handleRowClick}
                  minWidth={1300}
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

export default TankDimensionManagerList;
