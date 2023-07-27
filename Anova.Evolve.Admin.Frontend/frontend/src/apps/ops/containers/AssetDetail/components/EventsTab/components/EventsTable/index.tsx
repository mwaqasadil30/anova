/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
  ActiveEventGetResp,
  EventStatusType,
  InactiveEventGetResp,
} from 'api/admin/api';
import routes from 'apps/ops/routes';
import FormatDateTime from 'components/FormatDateTime';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router';
import {
  Cell,
  Column,
  HeaderGroup,
  Row,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { isNumber } from 'utils/format/numbers';
import {
  buildEventRuleTypeTextMapping,
  buildImportanceLevelTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import { renderImportance } from 'utils/ui/helpers';
import {
  columnIdToAriaLabel,
  EventsTabColumnId,
  getColumnWidth,
} from '../../helpers';
import AssetTitleCell from '../AssetTitleCell';

type GenericTableRecord = ActiveEventGetResp | InactiveEventGetResp;

interface Props {
  initialSortByColumnId: any;
  initialSortByColumnIsDescending: any;
  isCellDisabled: boolean;
  records: GenericTableRecord[];
  selectedEventStatus: EventStatusType;
  pageIndex: number;
  pageSize: number;
}

const EventsTable = ({
  initialSortByColumnId,
  initialSortByColumnIsDescending,
  isCellDisabled,
  records,
  selectedEventStatus,
  pageIndex,
  pageSize,
}: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);
  const eventRuleTypeTextMapping = buildEventRuleTypeTextMapping(t);

  const columns: Column<GenericTableRecord>[] = React.useMemo(
    () => [
      {
        id: EventsTabColumnId.HasNotes,
        Header: t('ui.common.notes', 'Notes') as string,
        accessor: (event: GenericTableRecord) => {
          if (event.hasNotes !== undefined) {
            return formatBooleanToYesOrNoString(event.hasNotes, t);
          }
          return '';
        },
      },

      {
        id: EventsTabColumnId.CreatedOn,
        Header: t('ui.events.createdon', 'Created On') as string,
        accessor: EventsTabColumnId.CreatedOn,
        Cell: (cell: Cell<GenericTableRecord>) => {
          const date = cell.value;
          if (date) {
            return <FormatDateTime date={date} />;
          }
          return '';
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: EventsTabColumnId.DeactivatedOn,
        Header: t('ui.events.inactivedate', 'Inactive Date') as string,
        accessor: (event: GenericTableRecord) => {
          if ('deactivatedOn' in event && event.deactivatedOn) {
            return <FormatDateTime date={event.deactivatedOn} />;
          }
          return '';
        },
        sortDescFirst: true,
      },
      {
        id: EventsTabColumnId.EventDescription,
        Header: t('ui.events.eventname', 'Event Name') as string,
        accessor: EventsTabColumnId.EventDescription,
      },
      {
        id: EventsTabColumnId.EventImportanceLevel,
        Header: t('ui.events.importancelevel', 'Importance Level') as string,
        accessor: EventsTabColumnId.EventImportanceLevel,
        Cell: (props: Cell<GenericTableRecord>) => {
          const { row } = props;
          const importanceLevel = row.original.eventImportanceLevel;

          if (!isNumber(importanceLevel)) {
            return null;
          }

          return (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{importanceLevelTextMapping[importanceLevel!]}</Grid>
              <Grid item>{renderImportance(importanceLevel)}</Grid>
            </Grid>
          );
        },
      },
      {
        id: EventsTabColumnId.AssetTitle,
        Header: t('ui.events.asset', 'Asset') as string,
        accessor: EventsTabColumnId.AssetTitle,
        Cell: AssetTitleCell,
      },
      {
        id: EventsTabColumnId.DataChannelType,
        Header: t('ui.common.datachannel', 'Data Channel') as string,
        accessor: (row: GenericTableRecord) => {
          if (row.dataChannelDescription) {
            return `${row.dataChannelDescription}`;
          }
          return '-';
        },
      },
      {
        id: EventsTabColumnId.Message,
        Header: t('ui.events.message', 'Message') as string,
        accessor: EventsTabColumnId.Message,
      },
      {
        id: EventsTabColumnId.ReadingTimestamp,
        Header: t('ui.common.readingtime', 'Reading Time') as string,
        accessor: EventsTabColumnId.ReadingTimestamp,
        Cell: (cell: Cell<GenericTableRecord>) => {
          const date = cell.value;
          if (date) {
            return <FormatDateTime date={date} />;
          }
          return '';
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: EventsTabColumnId.ReadingScaledValue,
        Header: t('ui.events.readingscaledvalue', 'Reading') as string,
        accessor: (event: GenericTableRecord) => {
          if (isNumber(event.readingValue)) {
            return `${event.readingValue} ${event.readingUnit}`;
          }
          return '-';
        },
      },
      {
        id: EventsTabColumnId.AcknowledgedOn,
        Header: t('ui.events.acknowledged', 'Acknowledged') as string,
        accessor: EventsTabColumnId.AcknowledgedOn,
        Cell: (cell: Cell<GenericTableRecord>) => {
          const date = cell.value;
          if (date) {
            return <FormatDateTime date={date} />;
          }
          return '-';
        },
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: EventsTabColumnId.AcknowledgeUserName,
        Header: t('ui.events.acknowledgedname', 'Acknowledged Name') as string,
        accessor: EventsTabColumnId.AcknowledgeUserName,
      },
      {
        id: EventsTabColumnId.Rosters,
        Header: t('ui.events.rosters', 'Roster(s)') as string,
        accessor: EventsTabColumnId.Rosters,
        Cell: (props: Cell<GenericTableRecord>) =>
          props.value ? props.value.join(', ') : '',
      },
      {
        id: EventsTabColumnId.Tags,
        Header: t('ui.common.tags', 'Tags') as string,
        accessor: EventsTabColumnId.Tags,
        Cell: (props: Cell<GenericTableRecord>) =>
          props.value ? props.value.join(', ') : '',
      },
      {
        id: EventsTabColumnId.EventType,
        Header: t('ui.events.eventtype', 'Event Type') as string,
        accessor: EventsTabColumnId.EventType,
        Cell: (props: Cell<GenericTableRecord>) =>
          // @ts-ignore
          eventRuleTypeTextMapping[props.value!] || '',
      },
    ],
    [t, records]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
  } = useTable<GenericTableRecord>(
    {
      initialState: {
        hiddenColumns:
          selectedEventStatus === EventStatusType.Inactive
            ? [EventsTabColumnId.EventId]
            : [EventsTabColumnId.EventId, EventsTabColumnId.DeactivatedOn],
        sortBy: [
          initialSortByColumnId
            ? {
                id: initialSortByColumnId,
                desc: initialSortByColumnIsDescending,
              }
            : {
                id: EventsTabColumnId.CreatedOn,
                desc: true,
              },
        ],
        pageSize,
        pageIndex,
      },
      // @ts-ignore
      columns,
      // @ts-ignore
      data: records,
      disableMultiSort: true,
      disableSortRemove: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
      // Pagination
      autoResetPage: true,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  // Sync react-table's page state with our manual pagination setup
  useEffect(() => {
    gotoPage(pageIndex);
  }, [pageIndex]);

  return (
    <TableContainer
      // Use max height here since the amount of rows in the table
      // may not exceed the height of the page. This allows the
      // scrollbar to appear at the bottom of the short table instead
      // of the bottom of the page.
      style={{ maxHeight: '100%' }}
    >
      <Table
        aria-label="event summary table"
        {...getTableProps()}
        style={{ minWidth: 1100, borderTop: 0 }}
        stickyHeader
      >
        <TableHead>
          {headerGroups.map((headerGroup: HeaderGroup<GenericTableRecord>) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const sortDirection = column.isSorted
                  ? column.isSortedDesc
                    ? 'desc'
                    : 'asc'
                  : undefined;
                const isAcknowledgeCell =
                  column.id === EventsTabColumnId.Acknowledge;
                return (
                  <TableHeadCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sortDirection={sortDirection}
                    align={isAcknowledgeCell ? 'center' : 'inherit'}
                    aria-label={columnIdToAriaLabel(column.id)}
                    style={{
                      minWidth: getColumnWidth(column.id),
                      padding: isAcknowledgeCell ? 0 : '4px 8px',
                      lineHeight: '24px',
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
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: Row<GenericTableRecord>) => {
            prepareRow(row);

            return (
              <TableRow
                {...row.getRowProps()}
                style={{
                  height: 35,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  // setSelectedEventId(row.original.eventId);
                  history.push(
                    generatePath(routes.events.detail, {
                      eventId: row.original.eventId,
                    })
                  );
                }}
                // Provide an id so we can easily scroll back to
                // this row if the user uses browser back/forward
                // navigation
                data-event-id={row.original.eventId}
              >
                {row.cells
                  .filter((cell) => !cell.isPlaceholder)
                  .map((cell) => {
                    const isAcknowledgeCell =
                      cell.column.id === EventsTabColumnId.Acknowledge;
                    const hasOnClickHandler = isAcknowledgeCell;
                    return (
                      <TableCell
                        {...cell.getCellProps()}
                        onClick={
                          hasOnClickHandler
                            ? (event) => {
                                event.stopPropagation();
                              }
                            : undefined
                        }
                        style={{
                          textAlign: isAcknowledgeCell ? 'center' : 'inherit',
                          width: isAcknowledgeCell ? 50 : 'inherit',
                          padding: isAcknowledgeCell ? 0 : '4px 8px',
                        }}
                        aria-label={columnIdToAriaLabel(cell.column.id)}
                      >
                        {cell.render('Cell', {
                          disabled: isCellDisabled,
                        })}
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventsTable;
