/* eslint-disable indent */
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import {
  RosterDto,
  RosterUserSummaryDto,
  UserPermissionType,
} from 'api/admin/api';
import AddButton from 'components/buttons/AddButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import {
  DeleteListItem,
  DeleteUnorderedList,
} from 'components/DeletionWarningDialog/styles';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import TableFooterCell from 'components/tables/components/TableFooterCell';
import TableActionCell from 'components/TableActionCell';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { SaveCallbackFunction } from 'containers/RosterEditor/types';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  Cell,
  Column,
  HeaderGroup,
  Hooks,
  Row,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import { Values } from '../ObjectForm/types';
import RosterUserInfoDrawer from '../RosterUserInfoDrawer';
import TableActionsAndPagination from '../TableActionsAndPagination';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  RosterUserColumnId,
} from './helpers';

const StyledLargeBoldDarkText = styled(Typography)`
  font-style: italic;
  font-size: 16px;
  font-weight: 500;
`;

const recordsDefault: RosterUserSummaryDto[] = [];

interface LocationState {
  openDrawer?: boolean;
}

interface Props {
  isCreating: boolean;
  isFetching: boolean;
  isLoadingInitial: boolean;
  isSubmitting: boolean;
  responseError: boolean;
  domainId?: string;
  rosterId?: number;
  rosterUsers?: RosterUserSummaryDto[] | null;
  submissionResult?: RosterDto;
  wasSavedViaAddContactButton: boolean;
  setWasSavedViaAddContactButton: (wasSaved: boolean) => void;
  saveCallback: SaveCallbackFunction;
  submitFormViaAddContact: FormikProps<Values>['submitForm'];
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const RosterUserTable = ({
  isCreating,
  isFetching,
  isLoadingInitial,
  isSubmitting,
  responseError,
  domainId,
  rosterId,
  rosterUsers,
  submissionResult,
  wasSavedViaAddContactButton,
  setWasSavedViaAddContactButton,
  saveCallback,
  submitFormViaAddContact,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();

  const hasPermission = useSelector(selectHasPermission);

  const canDelete = hasPermission(
    UserPermissionType.EventRosters,
    AccessType.Delete
  );

  const [selectedRows, setSelectedRows] = useState<
    Record<string, RosterUserSummaryDto>
  >({});

  const [
    selectedRosterUser,
    setSelectedRosterUser,
  ] = useState<RosterUserSummaryDto | null>(null);

  // Deletion
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    RosterUserSummaryDto[]
  >([]);
  const handleDeleteOne = (roster: RosterUserSummaryDto) => {
    if (roster.rosterUserId) {
      setRecordsToBeDeleted([roster]);
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

  const records = rosterUsers || recordsDefault;

  const data = React.useMemo(() => records, [records]);
  const columns: Column<RosterUserSummaryDto>[] = React.useMemo(
    () => [
      {
        Header: t('ui.rosterEditor.firstName', 'First Name') as string,
        accessor: RosterUserColumnId.FirstName,
      },
      {
        Header: t('ui.rosterEditor.lastName', 'Last Name') as string,
        accessor: RosterUserColumnId.LastName,
      },
      {
        Header: t('ui.rosterEditor.company', 'Company') as string,
        accessor: RosterUserColumnId.Company,
      },
      {
        Header: t('ui.common.enabled', 'Enabled') as string,
        accessor: RosterUserColumnId.Enabled,
        disableGlobalFilter: true,
        Cell: (cell: Cell<RosterUserSummaryDto>) => {
          if (typeof cell.value === 'boolean') {
            return formatBooleanToYesOrNoString(cell.value, t);
          }
          return '';
        },
      },
      {
        Header: t(
          'ui.rosterEditor.notificationByEmail',
          'Notification by email'
        ) as string,
        accessor: RosterUserColumnId.NotificationByEmail,
        disableGlobalFilter: true,
        Cell: (cell: Cell<RosterUserSummaryDto>) => {
          if (typeof cell.value === 'boolean') {
            return formatBooleanToYesOrNoString(cell.value, t);
          }
          return '';
        },
      },
      {
        Header: t('ui.rosterEditor.emailToPhone', 'Email to Phone') as string,
        accessor: RosterUserColumnId.IsEmailToPhoneSelected,
        disableGlobalFilter: true,
        Cell: (cell: Cell<RosterUserSummaryDto>) => {
          if (typeof cell.value === 'boolean') {
            return formatBooleanToYesOrNoString(cell.value, t);
          }
          return '';
        },
      },
      {
        id: RosterUserColumnId.ContactAddresses,
        Header: t(
          'ui.rosterEditor.contactAddresses',
          'Contact Address(es)'
        ) as string,
        accessor: (record: RosterUserSummaryDto) => {
          const contactAddresses = [];
          if (record.isEmailSelected && record.emailAddress) {
            contactAddresses.push(record.emailAddress);
          }
          if (record.isEmailToPhoneSelected && record.emailToPhoneAddress) {
            contactAddresses.push(record.emailToPhoneAddress);
          }
          return contactAddresses.join(', ');
        },
      },
      {
        id: RosterUserColumnId.MessageTemplates,
        Header: t(
          'ui.rosterEditor.messageTemplate',
          'Message Template'
        ) as string,
        accessor: (record: RosterUserSummaryDto) => {
          const messageTemplateNames = [];
          if (record.isEmailSelected && record.emailMessageTemplateName) {
            messageTemplateNames.push(record.emailMessageTemplateName);
          }
          if (
            record.isEmailToPhoneSelected &&
            record.emailToPhoneMessageTemplateName
          ) {
            messageTemplateNames.push(record.emailToPhoneMessageTemplateName);
          }
          return messageTemplateNames.join(', ');
        },
      },
    ],
    [t, selectedRows]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    visibleColumns,
    prepareRow,
    setHiddenColumns,
  } = useTable<RosterUserSummaryDto>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: {
        hiddenColumns,
        sortBy: [
          {
            id: RosterUserColumnId.FirstName,
            desc: false,
          },
        ],
      },
      // Sortingactions = {},
      disableMultiSort: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useSortBy,
    useRowSelect,
    (hooks: Hooks<RosterUserSummaryDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                (row.values as RosterUserSummaryDto) &&
                row?.original?.rosterUserId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.rosterUserId!]
              );
            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'rosterUserId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          Cell: ({ row }: { row: Row<RosterUserSummaryDto> }) => (
            <TableCellCheckbox
              onChange={() =>
                setSelectedRows((prevSelectedRows) => {
                  const newSelectedRows = toggleOneSelectedRow(
                    prevSelectedRows,
                    row,
                    'rosterUserId'
                  );

                  return newSelectedRows;
                })
              }
              checked={!!selectedRows[row.original.rosterUserId!] || false}
              // disabled={isDisabled(row.values as RosterUserEditModel)}
            />
          ),
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

  const deleteRecords = () => {
    // Check for items that are not selected to be deleted
    const updatedRecords = rosterUsers?.filter(
      (record) => !recordsToBeDeleted.includes(record)
    );

    // Set and Update the rosters field with the updated list of rosters
    setFieldValue('rosterUsers', updatedRecords);
  };

  const handleConfirmDelete = () => {
    deleteRecords();

    // Close the deletion dialog
    setIsDeleteDialogOpen(false);

    // Clear selected rows / deleted records
    setSelectedRows({});
    setRecordsToBeDeleted([]);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  // Reset hidden columns if they change (example: user permissions are updated)
  useEffect(() => {
    setHiddenColumns(hiddenColumns);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [hiddenColumns]);

  // User Information Drawer
  const [isUserInfoDrawerOpen, setIsUserInfoDrawerOpen] = useState(false);

  const closeUserInfoDrawer = () => {
    setIsUserInfoDrawerOpen(false);

    // Clear the route state so that the Roster User drawer doesn't open again
    // when re-fetching data (clicking the Cancel button). The drawer is
    // triggered to open if the user clicked on the "Add Contact" button when
    // they were creating a Roster.
    history.replace(location.pathname);
  };

  const openUserInfoDrawer = (rosterUser: RosterUserSummaryDto | null) => {
    setSelectedRosterUser(rosterUser);
    setIsUserInfoDrawerOpen(true);
  };
  const handleClickAddContact = () => {
    if (isCreating) {
      submitFormViaAddContact();
    } else {
      openUserInfoDrawer(null);
    }
  };

  // Save the Roster after the user has clicked on the "Add Contact" button
  useEffect(() => {
    // This condition is true when the roster is created successfully
    if (
      wasSavedViaAddContactButton &&
      !rosterId &&
      submissionResult?.rosterId
    ) {
      saveCallback(submissionResult, { openDrawer: true });
      setWasSavedViaAddContactButton(false);
    }
  }, [submissionResult?.rosterId]);

  // Open the Roster User Info Drawer if the user landed on the Roster Editor
  // page after creating the Roster via the "Add Contact" button
  useEffect(() => {
    if (location.state?.openDrawer) {
      openUserInfoDrawer(null);
    }
  }, []);

  const saveAndExitUserInfoDrawerCallback = (
    rosterUser: RosterUserSummaryDto
  ) => {
    // Update the list of roster users in the table based on if a new roster
    // user is being added, or an existing one is being edited
    const rosterUserToUpdate = rosterUsers?.find(
      (user) => user.rosterUserId === rosterUser.rosterUserId
    );

    if (rosterUserToUpdate) {
      const newRosterUsers = rosterUsers?.map((user) => {
        if (user.rosterUserId === rosterUser.rosterUserId) {
          return rosterUser;
        }

        return user;
      });

      setFieldValue('rosterUsers', newRosterUsers);
    } else {
      const originalRosterUsers = rosterUsers || [];
      setFieldValue('rosterUsers', [...originalRosterUsers, rosterUser]);
    }

    closeUserInfoDrawer();
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <DeletionWarningDialog
          open={isDeleteDialogOpen}
          handleConfirm={handleConfirmDelete}
          handleCancel={handleCancelDelete}
          recordCount={recordsToBeDeleted.length}
        >
          {!!recordsToBeDeleted.length && (
            <DeleteUnorderedList>
              {recordsToBeDeleted.map((record) => {
                const fullName = [record.firstName, record.lastName]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <DeleteListItem key={record.rosterUserId!}>
                    {fullName}
                  </DeleteListItem>
                );
              })}
            </DeleteUnorderedList>
          )}
        </DeletionWarningDialog>
      </Grid>
      <Grid item xs={12}>
        <TransitionLoadingSpinner in={isLoadingInitial || isFetching} />
        <TransitionErrorMessage in={!isLoadingInitial && !!responseError} />

        <Fade in={!isLoadingInitial && !responseError}>
          <div>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <TableActionsAndPagination
                  showActions={canDelete}
                  disableActions={!Object.values(selectedRows).some((_) => _)}
                  totalRows={rows.length}
                  actions={{
                    deleteSelected: () => {
                      setRecordsToBeDeleted(Object.values(selectedRows));
                      setIsDeleteDialogOpen(true);
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <DarkFadeOverlay darken={isFetching}>
                  <TableContainer>
                    <Table
                      aria-label="roster contacts table"
                      {...getTableProps()}
                      style={{ minWidth: 1100 }}
                    >
                      <TableHead>
                        {headerGroups.map(
                          (headerGroup: HeaderGroup<RosterUserSummaryDto>) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                              {headerGroup.headers.map((column) => {
                                const sortDirection = column.isSorted
                                  ? column.isSortedDesc
                                    ? 'desc'
                                    : 'asc'
                                  : undefined;
                                const isSelectionCell =
                                  column.id === 'selection';
                                const isActionCell = column.id === 'action';
                                return (
                                  <TableHeadCell
                                    {...column.getHeaderProps(
                                      column.getSortByToggleProps()
                                    )}
                                    aria-label={columnIdToAriaLabel(column.id)}
                                    sortDirection={sortDirection}
                                    align={
                                      isSelectionCell || isActionCell
                                        ? 'center'
                                        : 'inherit'
                                    }
                                    style={{
                                      lineHeight: '16px',
                                      height: 25,
                                      minWidth:
                                        isSelectionCell || isActionCell
                                          ? 40
                                          : getColumnWidth(column.id),
                                      padding:
                                        isSelectionCell || isActionCell
                                          ? 0
                                          : '7px 16px',
                                    }}
                                  >
                                    <TableSortLabel
                                      active={column.canSort && column.isSorted}
                                      direction={sortDirection}
                                      hideSortIcon={!column.canSort}
                                    >
                                      {column.render('Header')}
                                    </TableSortLabel>
                                  </TableHeadCell>
                                );
                              })}
                            </TableRow>
                          )
                        )}
                      </TableHead>
                      <TableBody {...getTableBodyProps()}>
                        {rows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={visibleColumns.length}>
                              <StyledLargeBoldDarkText>
                                {t(
                                  'ui.rosterEditor.empty',
                                  'No roster users found'
                                )}
                              </StyledLargeBoldDarkText>
                            </TableCell>
                          </TableRow>
                        ) : (
                          rows.map((row: Row<RosterUserSummaryDto>) => {
                            prepareRow(row);

                            return (
                              <TableRow
                                {...row.getRowProps()}
                                style={{ height: 40, cursor: 'pointer' }}
                                onClick={() => {
                                  openUserInfoDrawer(row.original);
                                }}
                              >
                                {row.cells
                                  .filter((cell) => !cell.isPlaceholder)
                                  .map((cell) => {
                                    const isSelectionCell =
                                      cell.column.id === 'selection';
                                    const isActionCell =
                                      cell.column.id === 'action';
                                    const isInteractiveCell =
                                      isSelectionCell || isActionCell;
                                    return (
                                      <TableCell
                                        {...cell.getCellProps()}
                                        onClick={
                                          isInteractiveCell
                                            ? (event) => event.stopPropagation()
                                            : undefined
                                        }
                                        aria-label={columnIdToAriaLabel(
                                          cell.column.id
                                        )}
                                        style={{
                                          textAlign:
                                            isSelectionCell || isActionCell
                                              ? 'center'
                                              : 'inherit',
                                          width:
                                            isSelectionCell || isActionCell
                                              ? 40
                                              : 'inherit',
                                          padding:
                                            isSelectionCell || isActionCell
                                              ? 0
                                              : '5px 24px 5px 16px',
                                        }}
                                      >
                                        {cell.render('Cell', {
                                          disabled: isFetching,
                                          handleDelete: handleDeleteOne,
                                        })}
                                      </TableCell>
                                    );
                                  })}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableFooterCell
                            variant="footer"
                            colSpan={visibleColumns.length}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={7}>
                                <AddButton
                                  variant="outlined"
                                  onClick={handleClickAddContact}
                                  disabled={isSubmitting}
                                >
                                  {isCreating
                                    ? t(
                                        'ui.rosterEditor.saveRosterAndAddContact',
                                        'Save Roster & Add Contact'
                                      )
                                    : t(
                                        'ui.rosterEditor.addContact',
                                        'Add Contact'
                                      )}
                                </AddButton>
                              </Grid>
                              <Drawer
                                anchor="right"
                                open={isUserInfoDrawerOpen}
                                onClose={closeUserInfoDrawer}
                                variant="temporary"
                                disableBackdropClick
                              >
                                <DrawerContent>
                                  {rosterId && (
                                    <RosterUserInfoDrawer
                                      domainId={domainId}
                                      rosterUser={selectedRosterUser}
                                      rosterId={rosterId}
                                      cancelCallback={closeUserInfoDrawer}
                                      saveAndExitCallback={
                                        saveAndExitUserInfoDrawerCallback
                                      }
                                    />
                                  )}
                                </DrawerContent>
                              </Drawer>
                            </Grid>
                          </TableFooterCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </DarkFadeOverlay>
              </Grid>
            </Grid>
          </div>
        </Fade>
      </Grid>
    </Grid>
  );
};

export default RosterUserTable;
