/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { MessageTemplate_SummaryDto, UserPermissionType } from 'api/admin/api';
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
import { caseInsensitive } from 'utils/tables';
import { toggleAllSelectedRows, toggleOneSelectedRow } from 'utils/ui/deletion';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  getColumnWidth,
  isRecordDisabled,
  MessageTemplateListColumnId,
} from './helpers';
import { useDeleteMessageTemplates } from './hooks/useDeleteMessageTemplate';
import { useGetMessageTemplatesByDomainId } from './hooks/useRetrieveMessageTemplatesByDomainId';

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

const recordsDefault: MessageTemplate_SummaryDto[] = [];

const MessageTemplateManagerList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const hasPermission = useSelector(selectHasPermission);
  const canDeleteMessageTemplate = hasPermission(
    UserPermissionType.EventMessageTemplates,
    AccessType.Delete
  );

  const domainId = useSelector(selectActiveDomainId);

  const retrieveMessageTemplateApi = useGetMessageTemplatesByDomainId(
    domainId!
  );

  const topOffset = useSelector(selectTopOffset);

  // Set up hidden columns
  // IMPORTANT NOTE: To avoid an infinite loop, we need to memoize
  // hiddenColumns.
  const hiddenPermissionColumns = canDeleteMessageTemplate
    ? []
    : ['selection', 'action'];
  const hiddenColumns = React.useMemo(() => [...hiddenPermissionColumns], [
    hiddenPermissionColumns.join(','),
  ]);

  const records = retrieveMessageTemplateApi.data || recordsDefault;

  const [selectedRows, setSelectedRows] = useState<
    Record<string, MessageTemplate_SummaryDto>
  >({});

  // Deletion
  const deleteMessageTemplateApi = useDeleteMessageTemplates();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordsToBeDeleted, setRecordsToBeDeleted] = useState<
    MessageTemplate_SummaryDto[]
  >([]);
  const handleDeleteOne = (messageTemplate: MessageTemplate_SummaryDto) => {
    if (messageTemplate.messageTemplateId) {
      setRecordsToBeDeleted([messageTemplate]);
      setIsDeleteDialogOpen(true);
    }
  };

  const isFetching =
    retrieveMessageTemplateApi.isFetching || deleteMessageTemplateApi.isLoading;
  const isLoading =
    retrieveMessageTemplateApi.isLoading || deleteMessageTemplateApi.isLoading;

  const data = React.useMemo(() => [...records], [records, selectedRows]);
  const columns: Column<MessageTemplate_SummaryDto>[] = React.useMemo(
    () => [
      {
        Header: t('ui.common.description', 'Description') as string,
        accessor: MessageTemplateListColumnId.Description,
      },
      {
        Header: t(
          'ui.messageTemplateList.rosterCount',
          'Roster Count'
        ) as string,
        accessor: MessageTemplateListColumnId.RosterCount,
        sortType: 'basic',
      },
    ],
    // NOTE: We need to put selectedRows in the list of dependencies in order
    // to make the select all checkbox in the Header column to work
    // Other pages with client-side searching do the same
    [t, selectedRows]
  );

  const tableInstance = useTable<MessageTemplate_SummaryDto>(
    {
      columns,
      data,
      initialState: {
        hiddenColumns,
        sortBy: [
          {
            id: MessageTemplateListColumnId.Description,
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
    (hooks: Hooks<MessageTemplate_SummaryDto>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: 'selection',
          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) =>
                row.original.messageTemplateId &&
                !isRecordDisabled(row.original)
            );

            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row.original.messageTemplateId!]
              );

            return (
              <TableCellCheckbox
                onChange={() => {
                  const newSelectedRows = toggleAllSelectedRows(
                    selectedRows,
                    selectableRows,
                    'messageTemplateId'
                  );
                  setSelectedRows(newSelectedRows);
                }}
                checked={areAllRowsSelected}
                disabled={!selectableRows.length}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },

          Cell: ({ row }: { row: Row<MessageTemplate_SummaryDto> }) => {
            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows((prevSelectedRows) => {
                    const newSelectedRows = toggleOneSelectedRow(
                      prevSelectedRows,
                      row,
                      'messageTemplateId'
                    );
                    return newSelectedRows;
                  })
                }
                checked={
                  !!selectedRows[row.original.messageTemplateId!] || false
                }
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
    retrieveMessageTemplateApi.refetch();
  }, [retrieveMessageTemplateApi.refetch]);

  const deleteRecords = () => {
    const messageTemplateIdsToBeDeleted = recordsToBeDeleted
      .filter((record) => record.messageTemplateId)
      .map((record) => record.messageTemplateId!);

    return deleteMessageTemplateApi
      .mutateAsync(messageTemplateIdsToBeDeleted)
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

  const handleRowClick = (row: Row<MessageTemplate_SummaryDto>) => {
    history.push(
      generatePath(routes.messageTemplateManager.edit, {
        messageTemplateId: row.original.messageTemplateId,
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
        isDeleting={deleteMessageTemplateApi.isLoading}
        hasError={!!deleteMessageTemplateApi.error}
        recordCount={recordsToBeDeleted.length}
      >
        {!!recordsToBeDeleted.length && (
          <DeleteUnorderedList>
            {recordsToBeDeleted.map((record) => (
              <DeleteListItem key={record.messageTemplateId}>
                {record.description}
              </DeleteListItem>
            ))}
          </DeleteUnorderedList>
        )}
      </DeletionWarningDialog>

      <BoxWithOverflowHidden pt={1} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage
          in={!isLoading && !!retrieveMessageTemplateApi.isError}
        />

        <Fade
          in={
            !isLoading &&
            !retrieveMessageTemplateApi.isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !retrieveMessageTemplateApi.isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t(
                      'ui.messageTemplateList.noMessageTemplatesFound',
                      'No message templates found'
                    )}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={
            !isLoading &&
            !retrieveMessageTemplateApi.isError &&
            tableInstance.rows.length > 0
          }
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                shouldShowActions={canDeleteMessageTemplate}
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
                <GenericDataTable<MessageTemplate_SummaryDto>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="message template manager table"
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

export default MessageTemplateManagerList;
