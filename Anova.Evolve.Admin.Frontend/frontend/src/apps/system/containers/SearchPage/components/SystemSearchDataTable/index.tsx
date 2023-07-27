/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';

import { useTheme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { ListSortDirection2 } from 'api/admin/api';

import Table, {
  TableProps as ITableProps,
} from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer, {
  TableContainerProps as ITableContainerProps,
} from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React from 'react';
import { Cell, HeaderGroup, Row, TableInstance } from 'react-table';
import styled, { css } from 'styled-components';
import { RowIdentifier, RtuSearchResultDTOColumnId } from '../../types';

const StyledTable = styled(Table)<{ $minWidth?: number }>`
  min-width: ${(props) =>
    props.$minWidth ? `${props.$minWidth}px` : `1100px`};
`;

const StyledButtonLink = styled(ButtonBase)`
  text-align: left;
  padding: 0;
  text-decoration: underline;
  &&:hover,
  &&:focus,
  &&:active {
    background-color: inherit;
  }
`;

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

const sharedTextOverflowStyles = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const OverflowTextBox = styled(Box)`
  ${sharedTextOverflowStyles}
`;

interface Props<T extends object> {
  tableInstance: TableInstance<T>;
  disableActions: boolean;
  tableAriaLabelText: string;
  minWidth?: number;
  TableProps?: ITableProps;
  sortByColumn: string;
  pageNumber: number;
  sortByColumnDirection: ListSortDirection2;
  TableContainerProps?: ITableContainerProps;
  clickedRowIdentifier?: RowIdentifier | null;
  isRecordDisabled: (record: T) => boolean;
  columnIdToAriaLabel: (columnId: string) => string;
  getColumnWidth: (columnId: string) => number;
  handleDeleteOne?: (record: T) => void;
  handleRowOrCellClick: (row: Row<T>, cell?: Cell<T>) => void;
  handleSortByColumnIdChange: (columnId: string) => void;
}

const SystemSearchDataTable = <T extends object>({
  tableInstance,
  disableActions,
  tableAriaLabelText,
  TableProps,
  sortByColumn,
  sortByColumnDirection,
  TableContainerProps,
  minWidth = 1100,
  isRecordDisabled,
  columnIdToAriaLabel,
  getColumnWidth,
  handleDeleteOne,
  handleRowOrCellClick,
  handleSortByColumnIdChange,
  clickedRowIdentifier,
  pageNumber,
}: Props<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const theme = useTheme();

  const getAssetId = (cell?: Cell<any>) => {
    if (cell?.row?.original?.assetId) {
      return cell?.row?.original?.assetId;
    }
    return '';
  };

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
                  const sortDirection =
                    sortByColumnDirection === ListSortDirection2.Ascending
                      ? 'asc'
                      : 'desc';
                  const isSelectionCell = column.id === 'selection';
                  const isActionCell = column.id === 'action';
                  return (
                    <TableHeadCell
                      {...(column.canSort
                        ? column.getHeaderProps(column.getSortByToggleProps())
                        : column.getHeaderProps())}
                      aria-label={columnIdToAriaLabel(column.id)}
                      sortDirection={sortDirection}
                      onClick={() => {
                        handleSortByColumnIdChange(column.id);
                      }}
                      align={
                        isSelectionCell || isActionCell ? 'center' : 'inherit'
                      }
                      style={{
                        lineHeight: '16px',
                        height: 25,
                        width:
                          isSelectionCell || isActionCell
                            ? 40
                            : getColumnWidth(column.id),
                        padding:
                          isSelectionCell || isActionCell ? 0 : '7px 16px',
                      }}
                    >
                      <TableSortLabel
                        active={sortByColumn === column.id}
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
            return (
              <TableRow
                {...row.getRowProps()}
                style={{ height: 40, cursor: 'pointer' }}
                onClick={() => {
                  handleRowOrCellClick(row, undefined);
                }}
              >
                {row.cells
                  .filter((cell) => !cell.isPlaceholder)
                  .map((cell) => {
                    const isSelectionCell = cell.column.id === 'selection';
                    const isActionCell = cell.column.id === 'action';
                    const isAssetTitleCellWithAssetId =
                      cell.column.id === 'assetTitle' && !!getAssetId(cell);
                    const isInteractiveCell =
                      isSelectionCell ||
                      isActionCell ||
                      isAssetTitleCellWithAssetId;
                    const columnWidth = getColumnWidth(cell.column.id);
                    const isOverflowCell = () => {
                      switch (cell.column.id) {
                        case RtuSearchResultDTOColumnId.AssetTitle:
                          return true;
                        case RtuSearchResultDTOColumnId.SiteTitle:
                          return true;
                        case RtuSearchResultDTOColumnId.LatestPacketTimeStamp:
                          return true;
                        case RtuSearchResultDTOColumnId.LastBatteryVoltageTimestamp:
                          return true;
                        default:
                          return false;
                      }
                    };

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
                          backgroundColor: isRowLastClicked
                            ? theme.custom.palette.table.rowHoverColor
                            : 'inherit',

                          textAlign:
                            isSelectionCell || isActionCell
                              ? 'center'
                              : 'inherit',
                          width:
                            isSelectionCell || isActionCell ? 40 : columnWidth,
                          padding:
                            isSelectionCell || isActionCell
                              ? 0
                              : '5px 24px 5px 16px',
                        }}
                      >
                        {isAssetTitleCellWithAssetId ? (
                          <StyledButtonLink
                            disableRipple
                            onClick={() => {
                              handleRowOrCellClick(row, cell);
                            }}
                          >
                            <OverflowTextBox
                              width={columnWidth}
                              title={cell.value}
                            >
                              {cell.render('Cell', {
                                disabled: disableActions,
                                handleDelete: handleDeleteOne,
                                isRecordDisabled,
                              })}
                            </OverflowTextBox>
                          </StyledButtonLink>
                        ) : isOverflowCell() ? (
                          <OverflowTextBox
                            width={columnWidth}
                            title={cell.value}
                          >
                            {cell.render('Cell', {
                              disabled: disableActions,
                              handleDelete: handleDeleteOne,
                              isRecordDisabled,
                            })}
                          </OverflowTextBox>
                        ) : (
                          cell.render('Cell', {
                            disabled: disableActions,
                            handleDelete: handleDeleteOne,
                            isRecordDisabled,
                          })
                        )}
                      </StyledTableCell>
                    );
                  })}
              </TableRow>
            );
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default SystemSearchDataTable;
