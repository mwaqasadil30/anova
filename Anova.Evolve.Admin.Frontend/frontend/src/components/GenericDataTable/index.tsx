import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Table, {
  TableProps as ITableProps,
} from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer, {
  TableContainerProps as ITableContainerProps,
} from 'components/tables/components/TableContainer';
import { lighten } from '@material-ui/core/styles';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { RowIdentifier } from 'containers/AssetManagerList/types';
import React from 'react';
import { HeaderGroup, Row, TableInstance } from 'react-table';
import styled from 'styled-components';

const StyledTable = styled(Table)<{ $minWidth?: number }>`
  min-width: ${(props) =>
    props.$minWidth ? `${props.$minWidth}px` : `1100px`};
`;

const StyledDiv = styled.div`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.uniqueLineHeight};
  vertical-align: middle;
  display: flex;
  font-weight: 500;
`;

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

const StyledTableRow = styled(({ isRowLastClicked, ...props }) => (
  <TableRow {...props} />
))`
  height: 40;
  cursor: pointer;
  ${(props) =>
    props.isRowLastClicked &&
    `background-color: ${
      props.theme.palette.type === 'light'
        ? lighten(props.theme.custom.domainColor, 0.83)
        : props.theme.custom.palette.table.rowHoverColor
    };`}
`;

interface Props<T extends object> {
  tableInstance: TableInstance<T>;
  disableActions: boolean;
  tableAriaLabelText: string;
  minWidth?: number;
  TableProps?: ITableProps;
  TableContainerProps?: ITableContainerProps;
  pageNumber?: number;
  clickedRowIdentifier?: RowIdentifier | null;
  isRecordDisabled: (record: T) => boolean;
  columnIdToAriaLabel: (columnId: string) => string;
  getColumnWidth: (columnId: string) => number;
  handleDeleteOne?: (record: T) => void;
  handleRowClick: (row: Row<T>) => void;
}

const GenericDataTable = <T extends object>({
  tableInstance,
  disableActions,
  tableAriaLabelText,
  TableProps,
  TableContainerProps,
  pageNumber,
  clickedRowIdentifier,
  minWidth = 1100,
  isRecordDisabled,
  columnIdToAriaLabel,
  getColumnWidth,
  handleDeleteOne,
  handleRowClick,
}: Props<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <TableContainer {...TableContainerProps}>
      <StyledTable
        $minWidth={minWidth}
        aria-label={tableAriaLabelText}
        {...getTableProps()}
        {...TableProps}
      >
        <TableHead>
          {headerGroups.map((headerGroup: HeaderGroup<T>) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers
                .filter((column) => !column.isGrouped)
                .map((column) => {
                  const sortDirection = column.isSorted
                    ? column.isSortedDesc
                      ? 'desc'
                      : 'asc'
                    : undefined;
                  const isSelectionCell = column.id === 'selection';
                  const isActionCell = column.id === 'action';
                  return (
                    <TableHeadCell
                      {...(column.canSort
                        ? column.getHeaderProps(column.getSortByToggleProps())
                        : column.getHeaderProps())}
                      aria-label={columnIdToAriaLabel(column.id)}
                      sortDirection={sortDirection}
                      align={
                        isSelectionCell || isActionCell ? 'center' : 'inherit'
                      }
                      style={{
                        lineHeight: '16px',
                        height: 25,
                        minWidth:
                          isSelectionCell || isActionCell
                            ? 40
                            : getColumnWidth(column.id),
                        padding:
                          isSelectionCell || isActionCell ? 0 : '7px 16px',
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
          {rows.map((row: Row<T>) => {
            prepareRow(row);
            const isRowLastClicked =
              row.id === clickedRowIdentifier?.rowIndex &&
              pageNumber === clickedRowIdentifier?.pageIndex;
            if (row.isGrouped) {
              const groupedCell = row.cells.find((cell) => cell.isGrouped);

              return (
                <TableGroupedRow {...row.getRowProps()}>
                  {groupedCell && (
                    <TableCell
                      colSpan={visibleColumns.length}
                      {...groupedCell.getCellProps()}
                      style={{ padding: '10px 16px' }}
                      aria-label={columnIdToAriaLabel(groupedCell.column.id)}
                    >
                      {/* NOTE:
                        We add a &nbsp; for grouped rows that dont display
                        any text so that it takes up the full height of a row.
                      */}
                      <StyledDiv>{groupedCell.render('Cell')} &nbsp;</StyledDiv>
                    </TableCell>
                  )}
                </TableGroupedRow>
              );
            }
            return (
              <StyledTableRow
                {...row.getRowProps()}
                isRowLastClicked={isRowLastClicked}
                onClick={() => {
                  handleRowClick(row);
                }}
              >
                {row.cells
                  .filter((cell) => !cell.isPlaceholder)
                  .map((cell) => {
                    const isSelectionCell = cell.column.id === 'selection';
                    const isActionCell = cell.column.id === 'action';
                    const isInteractiveCell = isSelectionCell || isActionCell;
                    return (
                      <StyledTableCell
                        {...cell.getCellProps()}
                        onClick={
                          isInteractiveCell
                            ? (event) => event.stopPropagation()
                            : undefined
                        }
                        aria-label={columnIdToAriaLabel(cell.column.id)}
                        style={{
                          textAlign:
                            isSelectionCell || isActionCell
                              ? 'center'
                              : 'inherit',
                          width:
                            isSelectionCell || isActionCell ? 40 : 'inherit',
                          padding:
                            isSelectionCell || isActionCell
                              ? 0
                              : '5px 24px 5px 16px',
                        }}
                      >
                        {cell.render('Cell', {
                          disabled: disableActions,
                          handleDelete: handleDeleteOne,
                          isRecordDisabled,
                        })}
                      </StyledTableCell>
                    );
                  })}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default GenericDataTable;
