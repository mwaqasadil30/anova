/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { RosterSummaryDto, UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
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
import { useRetrieveRostersByDomainId } from 'hooks/useRetrieveRostersByDomainId';
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
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  RosterListColumnId,
} from './helpers';
import { useDeleteRosters } from './hooks/useDeleteRoster';

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

const recordsDefault: RosterSummaryDto[] = [];

const RosterManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const hasPermission = useSelector(selectHasPermission);
  const canDeleteRoster = hasPermission(
    UserPermissionType.EventRosters,
    AccessType.Delete
  );

  const domainId = useSelector(selectActiveDomainId);

  const retrieveRostersApi = useRetrieveRostersByDomainId(domainId!);

  const topOffset = useSelector(selectTopOffset);

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDeleteRoster
    ? []
    : ['selection', 'action'];
  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records = retrieveRostersApi.data || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, RosterSummaryDto>
  >({});

  // Deletion
  const deleteRosterApi = useDeleteRosters();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    RosterSummaryDto[]
  >([]);
  const handleDeleteOne = (roster: RosterSummaryDto) => {
    if (roster.rosterId) {
      setRecordsToBeDeleted([roster]);
      setIsDeleteDialogOpen(true);
    }
  };

  const isFetching =
    retrieveRostersApi.isFetching || deleteRosterApi.isFetching;
  const isLoading = retrieveRostersApi.isLoading || deleteRosterApi.isFetching;

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns: Column<RosterSummaryDto>[] = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description') as string,
        accessor: RosterListColumnId.Description,
      },
      {
        Header: t('ui.common.enabled', 'Enabled') as string,
        accessor: RosterListColumnId.Enabled,
        Cell: (cell: Cell<RosterSummaryDto>) => {
          if (typeof cell.value === 'boolean') {
            return formatBooleanToYesOrNoString(cell.value, t);
          }
          return '';
        },
      },
      {
        Header: t('ui.rosterList.activeContacts', 'Active Contacts') as string,
        accessor: RosterListColumnId.ActiveContacts,
        sortType: 'basic',
      },
      {
        Header: t('ui.common.datachannels', 'Data Channels') as string,
        accessor: RosterListColumnId.DataChannels,
        sortType: 'basic',
      },
    ],
    // NOTE: We need to put selectedRows in the list of dependencies in order
    // to make the select all checkbox in the Header column to work
    // Other pages with client-side searching do the same
    [t, selectedRows]
  );

  const tableInstance = useTable<RosterSummaryDto>(
    {
      // @ts-ignore
      columns,

      // @ts-ignore
      data,
      initialState: {
        hiddenColumns,
        sortBy: [
          {
            id: RosterListColumnId.Description,
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
    (hooks: Hooks<RosterSummaryDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original.rosterId && !isRecordDisabled(row.original)
            );

            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.rosterId!]
              );

            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'rosterId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },

          Cell: ({ row }: { row: Row<RosterSummaryDto> }) => {
            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = toggleOneSelectedRow(
                      prevSelectedRows,
                      row,
                      'rosterId'
                    );
                    return newSelectedRows;
                  })
                }
                checked={!!selectedRows[row.original.rosterId!] || false}
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
    retrieveRostersApi.refetch();
  }, [retrieveRostersApi.refetch]);

  const deleteRecords = () => {
    const rosterIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.rosterId)
      .map((record) => record.rosterId!);

    return deleteRosterApi
      .makeRequest(rosterIdsToBeDeleted)

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

  const handleRowClick = (row: Row<RosterSummaryDto>) => {
    history.push(
      generatePath(routes.rosterManager.edit, {
        rosterId: row.original.rosterId,
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
        isDeleting={deleteRosterApi.isFetching}
        hasError={!!deleteRosterApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.rosterId}>
                {record.description}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={1} pb={8}>
        <Fade
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
          unmountOnExit
        >
          <div>
            {(tableInstance.rows.length === 0 && isFetching) || isLoading ? (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            ) : null}
          </div>
        </Fade>
        <Fade in={!isLoading && !!retrieveRostersApi.isError} unmountOnExit>
          <div>
            {retrieveRostersApi.isError && (
              <MessageBlock>
                <Typography variant="body2" color="error">
                  {t(
                    'ui.rosterList.unableToRetrieveRosterList',
                    'Unable to retrieve roster list'
                  )}
                </Typography>
              </MessageBlock>
            )}
          </div>
        </Fade>

        <Fade
          in={
            !isLoading &&
            !retrieveRostersApi.isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !retrieveRostersApi.isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.rosterList.noRostersFound', 'No rosters found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={
            !isLoading &&
            !retrieveRostersApi.isError &&
            tableInstance.rows.length > 0
          }
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                shouldShowActions={canDeleteRoster}
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
                <GenericDataTable<RosterSummaryDto>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="roster manager table"
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
    </Wrapper>
  );
};

export default RosterManagerList;
