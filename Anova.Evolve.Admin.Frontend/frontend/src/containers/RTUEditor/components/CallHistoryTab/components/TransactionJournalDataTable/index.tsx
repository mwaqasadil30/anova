import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { TransactionJournalRcmDto } from 'api/admin/api';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import Table, {
  TableProps as ITableProps,
} from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer, {
  TableContainerProps as ITableContainerProps,
} from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, HeaderGroup, Row, TableInstance } from 'react-table';
import styled from 'styled-components';
import {
  ParametersDrawerDetails,
  TransactionJournalColumnId,
} from '../../helpers';
import ParametersDrawer from '../ParametersDrawer';

const StyledTable = styled(Table)<{ $minWidth?: number }>`
  min-width: ${(props) =>
    props.$minWidth ? `${props.$minWidth}px` : `1100px`};
`;

const StyledDiv = styled.div`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.uniqueLineHeight};
  position: absolute;
  left: 16px;
  font-weight: 500;
`;

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

interface Props<T extends object> {
  tableInstance: TableInstance<T>;
  disableActions: boolean;
  tableAriaLabelText: string;
  minWidth?: number;
  TableProps?: ITableProps;
  TableContainerProps?: ITableContainerProps;
  isRecordDisabled: (record: T) => boolean;
  columnIdToAriaLabel: (columnId: string) => string;
  getColumnWidth: (columnId: string) => number;
  handleDeleteOne?: (record: T) => void;
  handleRowClick: (row: Row<T>) => void;
}

const TransactionJournalDataTable = <T extends object>({
  tableInstance,
  disableActions,
  tableAriaLabelText,
  TableProps,
  TableContainerProps,
  minWidth = 1100,
  isRecordDisabled,
  columnIdToAriaLabel,
  getColumnWidth,
  handleDeleteOne,
  handleRowClick,
}: Props<T>) => {
  const { t } = useTranslation();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    rows,
    prepareRow,
  } = tableInstance;

  const [
    parameterDetails,
    setParameterDetails,
  ] = useState<ParametersDrawerDetails | null>();

  const [isParametersDrawerOpen, setIsParametersDrawerOpen] = useState(false);

  const openParametersDrawer = (
    selectedCell: Cell<TransactionJournalRcmDto>
  ) => {
    setParameterDetails({
      label: selectedCell.column.id,
      value: selectedCell.value,
    });
    setIsParametersDrawerOpen(true);
  };

  const closeParametersDrawer = () => {
    setParameterDetails(null);
    setIsParametersDrawerOpen(false);
  };

  const formattedParametersDrawerTitle =
    parameterDetails?.label === TransactionJournalColumnId.ResponseParameters
      ? t('ui.rcmcalljournal.responseparameters', 'Response Parameters')
      : t('ui.rcmcalljournal.requestparameters', 'Request Parameters');

  return (
    <>
      <Drawer
        anchor="right"
        open={isParametersDrawerOpen}
        onClose={closeParametersDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <ParametersDrawer
            title={formattedParametersDrawerTitle}
            parameterData={parameterDetails?.value}
            cancelCallback={closeParametersDrawer}
          />
        </DrawerContent>
      </Drawer>
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
                    const isExpanderCell = column.id === 'expander';
                    return (
                      <TableHeadCell
                        {...(column.canSort
                          ? column.getHeaderProps(column.getSortByToggleProps())
                          : column.getHeaderProps())}
                        aria-label={columnIdToAriaLabel(column.id)}
                        sortDirection={sortDirection}
                        align={isExpanderCell ? 'center' : 'inherit'}
                        style={{
                          lineHeight: '16px',
                          height: 25,
                          minWidth: isExpanderCell
                            ? 40
                            : getColumnWidth(column.id),
                          padding: isExpanderCell ? 0 : '7px 16px',
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
                        <StyledDiv>{groupedCell.render('Cell')}</StyledDiv>
                        &nbsp;
                      </TableCell>
                    )}
                  </TableGroupedRow>
                );
              }
              return (
                <TableRow
                  {...row.getRowProps()}
                  style={{ height: 40, cursor: 'pointer' }}
                  onClick={() => {
                    handleRowClick(row);
                  }}
                >
                  {row.cells
                    .filter((cell) => !cell.isPlaceholder)
                    .map((cell) => {
                      const isExpanderCell = cell.column.id === 'expander';
                      const isInteractiveCell = isExpanderCell;

                      const isRequestParametersCell =
                        cell.column.id ===
                        TransactionJournalColumnId.RequestParameters;
                      const isResponseParametersCell =
                        cell.column.id ===
                        TransactionJournalColumnId.ResponseParameters;

                      const isParametersCell =
                        isRequestParametersCell || isResponseParametersCell;

                      return (
                        <StyledTableCell
                          {...cell.getCellProps()}
                          onClick={(event) => {
                            if (isInteractiveCell) {
                              event.stopPropagation();
                            }
                            if (isParametersCell) {
                              event.stopPropagation();
                              // @ts-ignore
                              openParametersDrawer(cell);
                            }
                            return undefined;
                          }}
                          aria-label={columnIdToAriaLabel(cell.column.id)}
                          style={{
                            textAlign: isExpanderCell ? 'center' : 'inherit',
                            width: isExpanderCell ? 40 : 'inherit',
                            padding: isExpanderCell ? 0 : '5px 24px 5px 16px',
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
                </TableRow>
              );
            })}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </>
  );
};

export default TransactionJournalDataTable;
