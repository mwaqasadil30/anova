/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { GeoAreaCategory, GeoAreaDto } from 'api/admin/api';
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
  Column,
  Hooks,
  Row,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import { selectCanDeleteGeofences } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { buildGeoAreaCategoryTypeTextMapping } from 'utils/i18n/enum-to-text';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  GeofenceListColumnId,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useDeleteGeofence } from './hooks/useDeleteGeofence';
import { useRetrieveGeoAreaList } from './hooks/useRetrieveGeoAreaList';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height: calc(...)` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: calc(100vh - ${props.topOffset}px - 16px);
    `};
`;

const recordsDefault: GeoAreaDto[] = [];

const GeofenceManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const geoAreaCategoryTypeMapping = buildGeoAreaCategoryTypeTextMapping(t);

  const canDeleteGeofences = useSelector(selectCanDeleteGeofences);

  const retrieveGeofencesApi = useRetrieveGeoAreaList();

  const topOffset = useSelector(selectTopOffset);

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns. Also, we always hide the selection column since the
  // deletion API only supported deleting one at a time.
  const hiddenPermissionColumns = canDeleteGeofences
    ? ['selection']
    : ['selection', 'action'];
  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records = retrieveGeofencesApi.data || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<Record<string, GeoAreaDto>>(
    {}
  );

  // Deletion
  const deleteGeofenceApi = useDeleteGeofence();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<GeoAreaDto[]>(
    []
  );
  const handleDeleteOne = (record: GeoAreaDto) => {
    if (record.id) {
      setRecordsToBeDeleted([record]);
      setIsDeleteDialogOpen(true);
    }
  };

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns: Column<GeoAreaDto>[] = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description') as string,
        accessor: GeofenceListColumnId.Description,
      },
      {
        Header: t('ui.common.type', 'Type') as string,
        accessor: GeofenceListColumnId.CategoryType,
        Cell: (cell: Cell<GeoAreaDto>) => {
          const category = cell.value as GeoAreaCategory;
          return geoAreaCategoryTypeMapping[category];
        },
      },
    ],
    // NOTE: We need to put selectedRows in the list of dependencies in order
    // to make the select all checkbox in the Header column to work
    // Other pages with client-side searching do the same
    [t, selectedRows]
  );

  const tableInstance = useTable<GeoAreaDto>(
    {
      columns,
      data,
      initialState: {
        hiddenColumns,
        sortBy: [
          {
            id: GeofenceListColumnId.Description,
            desc: false,
          },
        ],
      },
      // Sorting
      disableMultiSort: true,
      disableSortRemove: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<GeoAreaDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original.id && !isRecordDisabled(row.original)
            );

            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every((row) => selectedRows[row.original.id!]);

            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'id'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },

          Cell: ({ row }: { row: Row<GeoAreaDto> }) => {
            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = toggleOneSelectedRow(
                      prevSelectedRows,
                      row,
                      'id'
                    );
                    return newSelectedRows;
                  })
                }
                checked={!!selectedRows[row.original.id!] || false}
                disabled={isRecordDisabled(row.original)}
              />
            );
          },
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
        {
          id: 'action',
          Header: '',
          defaultCanSort: false,
          disableSortBy: true,
          Cell: TableActionCell,
        },
      ]);
    }
  );

  const refetchRecords = useCallback(() => {
    setSelectedRows({});
    retrieveGeofencesApi.refetch();
  }, [retrieveGeofencesApi.refetch]);

  const deleteRecords = () => {
    const geofenceIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.id)
      .map((record) => record.id!);

    if (!geofenceIdsToBeDeleted.length) {
      return;
    }

    deleteGeofenceApi
      .mutateAsync(geofenceIdsToBeDeleted[0])
      .then(() => {
        setSelectedRows({});
        setRecordsToBeDeleted([]);
        setIsDeleteDialogOpen(false);
      })
      .then(() => {
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

  const isFetching =
    retrieveGeofencesApi.isFetching || deleteGeofenceApi.isLoading;
  const isLoading =
    retrieveGeofencesApi.isLoading || deleteGeofenceApi.isLoading;

  const handleRowClick = (row: Row<GeoAreaDto>) => {
    history.push(
      generatePath(routes.geofenceManager.edit, {
        geofenceId: row.original.id,
      })
    );
  };

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro refetchRecords={refetchRecords} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions setGlobalFilter={tableInstance.setGlobalFilter} />
      </Box>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteGeofenceApi.isLoading}
        hasError={!!deleteGeofenceApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.id}>
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
        <TransitionErrorMessage
          in={!isLoading && !!retrieveGeofencesApi.isError}
        />

        <Fade
          in={
            !isLoading &&
            !retrieveGeofencesApi.isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !retrieveGeofencesApi.isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.geoAreaList.noGeoAreas', 'No Geofences found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={
            !isLoading &&
            !retrieveGeofencesApi.isError &&
            tableInstance.rows.length > 0
          }
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                // Since the API only supports deleting one record at time, we
                // don't show the actions
                // shouldShowActions={canDeleteGeofences}
                shouldDisableActions={
                  !Object.values(selectedRows).some((_) => _)
                }
                actions={{
                  deleteSelected: () => {
                    setRecordsToBeDeleted(Object.values(selectedRows));
                    setIsDeleteDialogOpen(true);
                  },
                }}
                count={tableInstance.rows.length}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<GeoAreaDto>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="geofence manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleDeleteOne={handleDeleteOne}
                  handleRowClick={handleRowClick}
                  minWidth={500}
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
    </Wrapper>
  );
};

export default GeofenceManagerList;
