/* eslint-disable indent */
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { DomainEventsDto } from 'api/admin/api';
import routes from 'apps/ops/routes';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React from 'react';
import { generatePath, useHistory } from 'react-router';
import { HeaderGroup, Row, TableInstance } from 'react-table';
import styled from 'styled-components';
import {
  columnIdToAriaLabel,
  EventSummaryListColumnId,
  getColumnWidth,
} from '../../helpers';

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

interface Props {
  isFetching: boolean;
  tableHookData: TableInstance<DomainEventsDto>;
  setSelectedEventId: (eventId?: number | undefined) => void;
}

const ActiveEventsTable = ({
  isFetching,
  tableHookData,
  setSelectedEventId,
}: Props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableHookData;

  const history = useHistory();
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
          {headerGroups.map((headerGroup: HeaderGroup<DomainEventsDto>) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const sortDirection = column.isSorted
                  ? column.isSortedDesc
                    ? 'desc'
                    : 'asc'
                  : undefined;
                const isAcknowledgeCell =
                  column.id === EventSummaryListColumnId.Acknowledge;
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
          {rows.map((row: Row<DomainEventsDto>) => {
            prepareRow(row);

            return (
              <TableRow
                {...row.getRowProps()}
                style={{
                  height: 35,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedEventId(row.original.eventId);
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
                      cell.column.id === EventSummaryListColumnId.Acknowledge;
                    const isAssetTitleCell =
                      cell.column.id === EventSummaryListColumnId.AssetTitle;
                    const hasOnClickHandler =
                      isAcknowledgeCell || isAssetTitleCell;
                    return (
                      <StyledTableCell
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
                          disabled: isFetching,
                        })}
                      </StyledTableCell>
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

export default ActiveEventsTable;
