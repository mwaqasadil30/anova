/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { UserGetResp, UserPermissionType } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import {
  DeleteListItem,
  DeleteUnorderedList,
} from 'components/DeletionWarningDialog/styles';
import FormatDateTime from 'components/FormatDateTime';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import GenericDataTable from 'components/GenericDataTable';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import TableActionCell from 'components/TableActionCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import uniq from 'lodash/uniq';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Column,
  Hooks,
  Row,
  useFilters,
  useGlobalFilter,
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
import styled from 'styled-components';
import { AccessType } from 'types';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  UserListColumnId,
} from './helpers';
import { useDeleteB2cUser } from './hooks/useDeleteB2cUser';
import { useDeleteUser } from './hooks/useDeleteUser';
import { useRetrieveUsersByDomainId } from './hooks/useRetrieveUsersByDomainId';

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

const recordsDefault: UserGetResp[] = [];

interface UserInfoRecordRowWithUserId
  extends Row<Omit<UserGetResp, 'userId'> & { userId: string }> {}

const UserManagerList = () => {
  const history = useHistory();
  const hasPermission = useSelector(selectHasPermission);
  const canDeleteUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Delete
  );

  const topOffset = useSelector(selectTopOffset);
  const domainId = useSelector(selectActiveDomainId);
  const currentUserId = useSelector(selectUserId);

  const retrieveUsersApi = useRetrieveUsersByDomainId();
  const deleteUserApi = useDeleteUser();
  const deleteB2cUserApi = useDeleteB2cUser();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<UserGetResp[]>(
    []
  );

  const handleDeleteOne = (user: UserGetResp) => {
    if (user.userId) {
      setRecordsToBeDeleted([user]);
      setIsDeleteDialogOpen(true);
    }
  };

  const isFetching =
    retrieveUsersApi.isFetching ||
    deleteUserApi.isFetching ||
    deleteB2cUserApi.isLoading;

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDeleteUser
    ? ['selection']
    : ['selection', 'action'];
  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records = retrieveUsersApi.data?.result || recordsDefault;

  const roleNameList =
    (records
      .map((userInfo) => {
        return userInfo.roleName;
      })
      .filter(Boolean) as string[]) || [];
  const uniqueRoleNames = uniq(roleNameList).sort();

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const { t } = useTranslation();
  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns: Column<UserGetResp>[] = React.useMemo(
    () => [
      {
        Header: t('ui.common.username', 'Username') as string,
        accessor: UserListColumnId.UserName,
      },
      {
        Header: t('ui.userEditor.companyName', 'Company Name') as string,
        accessor: UserListColumnId.CompanyName,
      },
      {
        Header: t('ui.userEditor.emailAddress', 'Email Address') as string,
        accessor: UserListColumnId.EmailAddress,
      },
      {
        Header: t('ui.userEditor.firstName', 'First Name') as string,
        accessor: UserListColumnId.FirstName,
      },
      {
        Header: t('ui.userEditor.lastName', 'Last Name') as string,
        accessor: UserListColumnId.LastName,
      },

      {
        Header: t('ui.userEditor.roleName', 'Role Name') as string,
        accessor: UserListColumnId.RoleName,
      },
      {
        Header: t('ui.userEditor.type', 'Type') as string,
        accessor: UserListColumnId.UserTypeValue,
      },
      {
        Header: t('ui.userEditor.isDeleted', 'Is Deleted') as string,
        accessor: (user: UserGetResp) => {
          if (typeof user.isDeleted === 'boolean') {
            return formatBooleanToYesOrNoString(user.isDeleted, t);
          }
          return '';
        },
      },
      {
        Header: t(
          'ui.userEditor.authProfileDescription',
          'Authentication Profile Description'
        ) as string,
        accessor: UserListColumnId.AuthenticationProfileDescription,
      },
      {
        Header: t('ui.userEditor.lastLoginDate', 'Last Login Date') as string,
        accessor: UserListColumnId.LastLoginDate,
        Cell: (cell: Cell<UserGetResp>) => {
          const user = cell.row.original;

          const lastLoginDate = moment(user.lastLoginDate);
          // NOTE:
          // Check if lastLoginDate year is > 1970 since some accounts would
          // have 12/31/0000 for their last login date
          // (BACKEND needs to confirm why this happens)
          if (lastLoginDate.isValid() && lastLoginDate.year() > 1970) {
            return <FormatDateTime date={user.lastLoginDate} />;
          }
          return '-';
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        Header: t(
          'ui.userEditor.transcendLoggedInDate',
          'Transcend Logged In Date'
        ) as string,
        accessor: UserListColumnId.TranscendLoggedInDate,
        Cell: (cell: Cell<UserGetResp>) => {
          const user = cell.row.original;

          const transcendLoggedInDate = moment(user.transcendLoggedInDate);

          if (
            transcendLoggedInDate.isValid() &&
            transcendLoggedInDate.year() > 1970
          ) {
            return <FormatDateTime date={user.transcendLoggedInDate} />;
          }
          return '-';
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
    ],
    // NOTE: We need to put selectedRows in the list of dependencies in order
    // to make the select all checkbox in the Header column to work
    // Other pages with client-side searching do the same
    [t, selectedRows]
  );

  const tableInstance = useTable<UserGetResp>(
    {
      // @ts-ignore
      columns,

      // @ts-ignore
      data,
      initialState: {
        // NOTE: Temporarily hiding the selection column until the deletion api
        // allows for selecting multiple users to delete
        hiddenColumns: ['selection'],
        sortBy: [
          {
            id: UserListColumnId.UserName,
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
    useFilters,
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<UserGetResp>) => {
      hooks.visibleColumns.push((hookColumns) => [
        {
          id: 'action',
          Header: '',
          defaultCanSort: false,
          disableSortBy: true,
          Cell: (props: any) => {
            const row = (props as Cell<UserGetResp>)?.row;

            // You can't delete yourself
            const isCurrentUser = currentUserId === row.original.userId;
            if (isCurrentUser) {
              return null;
            }

            return <TableActionCell {...props} />;
          },
        },
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original.userId
            ) as Row<UserGetResp>[];
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every((row) => selectedRows[row.original.userId!]);

            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows(
                    selectableRows.reduce<Record<string, boolean>>(
                      (mem, row) => {
                        mem[row.original.userId!] = !areAllRowsSelected;
                        return mem;
                      },
                      {}
                    )
                  )
                }
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          // this is a cheesy way to override type here, but I'm doing it for cleanness
          // real type is Row<UserGetResp>
          Cell: ({ row }: { row: UserInfoRecordRowWithUserId }) => {
            // You can't delete yourself
            const isCurrentUser = currentUserId === row.original.userId;
            if (isCurrentUser) {
              return null;
            }

            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = { ...prevSelectedRows };
                    newSelectedRows[row.original.userId] = !newSelectedRows[
                      row.original.userId
                    ];
                    return newSelectedRows;
                  })
                }
                checked={selectedRows[row.original.userId]}
              />
            );
          },
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  const refetchRecords = useCallback(() => {
    retrieveUsersApi.makeRequest(domainId!).catch(() => {});
  }, [retrieveUsersApi.makeRequest]);

  const deleteRecords = () => {
    const userIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.userId && !record.isUsingAadB2cForIdentity)
      .map((record) => record.userId!);

    const b2cUserIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.userId && record.isUsingAadB2cForIdentity)
      .map((record) => record.userId!);

    if (userIdsToBeDeleted.length) {
      deleteUserApi
        .makeRequest(userIdsToBeDeleted[0]) // Because we can only delete one at a time
        .then((response) => {
          if (response) {
            setSelectedRows({});
            refetchRecords();
            setIsDeleteDialogOpen(false);
          }
        })
        .catch(() => {});
    }

    if (b2cUserIdsToBeDeleted.length) {
      deleteB2cUserApi
        .mutateAsync(b2cUserIdsToBeDeleted[0]) // Because we can only delete one at a time
        .then(() => {
          setSelectedRows({});
          refetchRecords();
          setIsDeleteDialogOpen(false);
        })
        .catch(() => {});
    }
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

  const handleRowClick = (row: Row<UserGetResp>) => {
    history.push(
      generatePath(routes.userManager.edit, {
        userId: row.original.userId,
      })
    );
  };

  const tableStateForDownload = useMemo(
    () => ({
      rows: tableInstance.rows,
      visibleColumns: tableInstance.visibleColumns,
    }),
    [tableInstance.rows, tableInstance.visibleColumns]
  );

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro
          tableStateForDownload={tableStateForDownload}
          refetchRecords={refetchRecords}
        />
      </PageIntroWrapper>

      <DeletionWarningDialog
        open={isDeleteDialogOpen}
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
        isDeleting={deleteUserApi.isFetching || deleteB2cUserApi.isLoading}
        hasError={!!deleteUserApi.error || !!deleteB2cUserApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.userId}>
                {record.userName}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <Box pb={1}>
        <TableOptions
          filterData={(formData) => {
            tableInstance.setAllFilters([
              {
                id: formData.column,
                value: formData.text,
              },
            ]);
          }}
          uniqueRoleNames={uniqueRoleNames}
        />
      </Box>

      <BoxWithOverflowHidden pt={1} pb={8}>
        <Fade
          in={
            retrieveUsersApi.isLoadingInitial ||
            (tableInstance.rows.length === 0 && isFetching)
          }
          unmountOnExit
        >
          <div>
            {(tableInstance.rows.length === 0 && isFetching) ||
            retrieveUsersApi.isLoadingInitial ? (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            ) : null}
          </div>
        </Fade>
        <Fade
          in={!retrieveUsersApi.isLoadingInitial && !!retrieveUsersApi.error}
          unmountOnExit
        >
          <div>
            {retrieveUsersApi.error && (
              <MessageBlock>
                <Typography variant="body2" color="error">
                  {t(
                    'ui.userList.unableToRetrieveUserList',
                    'Unable to retrieve user list'
                  )}
                </Typography>
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade
          in={
            !retrieveUsersApi.isLoadingInitial &&
            !retrieveUsersApi.error &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!retrieveUsersApi.isLoadingInitial &&
              !retrieveUsersApi.error &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.userList.noUsersFound', 'No users found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={
            !retrieveUsersApi.isLoadingInitial &&
            !retrieveUsersApi.error &&
            tableInstance.rows.length > 0
          }
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <TableActionsAndPagination
              // NOTE: Comment out until the delete api allows
              // the deletion of multiple users re: the 'selection' column
              // shouldShowActions={canDeleteUser}
              // shouldDisableActions={
              //   !Object.values(selectedRows).some((_) => _)
              // }
              // actions={{
              //   deleteSelected: () => {
              //     deleteRecords(
              //       Object.keys(selectedRows).filter(
              //         (rowId) => selectedRows[rowId]
              //       )
              //     );
              //   },
              // }}
              count={tableInstance.rows.length}
            />
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<UserGetResp>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="user manager table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  handleDeleteOne={handleDeleteOne}
                  getColumnWidth={getColumnWidth}
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

export default UserManagerList;
