import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelType,
  EditAssetDataChannel,
  EvolveRetrieveAssetEditDetailsByIdResponse as Response,
} from 'api/admin/api';
import { ReactComponent as ChevronIcon } from 'assets/icons/single-chevron.svg';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableGroupedRow from 'components/tables/components/TableGroupedRow';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Cell,
  HeaderGroup,
  Hooks,
  useExpanded,
  useGroupBy,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import styled from 'styled-components';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  buildDataChannelTypeTextMapping,
  buildTankTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive } from 'utils/tables';
import { AssetEditorDataChannelColumnId, columnIdToAriaLabel } from './helpers';

const StyledChevronIcon = styled(ChevronIcon)`
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
`;

const StyledModificationText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  && {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
`;

const getNameByType = (rowType: DataChannelType | undefined, t: TFunction) => {
  switch (rowType) {
    case DataChannelType.Rtu:
      return t('ui.asset.rtudatachannels', 'RTU Data Channels');
    case DataChannelType.VirtualChannel:
      return t('ui.asset.virtualchannels', 'Virtual Channels');
    case DataChannelType.DigitalInput:
      return t('ui.asset.digitalchannels', 'Digital Channels');
    default:
      return t('ui.rtu.analogchannels', 'Analog Channels');
  }
};

const defaultRecords: EditAssetDataChannel[] = [];

const DataChannelTable = ({
  formik,
  setSelectedRows,
  selectedRows,
}: {
  formik: FormikProps<Response>;
  setSelectedRows: any;
  selectedRows: any;
}) => {
  const { t } = useTranslation();
  const records = formik.values.asset?.dataChannels || defaultRecords;
  const tankTypeTextMapping = buildTankTypeTextMapping(t);
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const data = React.useMemo(() => records, [records, selectedRows]);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [groupByColumn, setGroupByColumn] = useState([
    AssetEditorDataChannelColumnId.ChannelName,
  ]);

  const columns = React.useMemo(
    () => [
      {
        // this is not displayed and used for grouping
        id: AssetEditorDataChannelColumnId.ChannelName,
        Header: 'Channel Name',
        accessor: (row: EditAssetDataChannel) => {
          return getNameByType(row.type, t);
        },
      },
      {
        id: AssetEditorDataChannelColumnId.Description,
        Header: t('ui.common.description', 'Description'),
        accessor: 'description',
      },
      {
        id: AssetEditorDataChannelColumnId.RtuDeviceId,
        Header: t('ui.datachannel.rtudeviceid', 'RTU Device ID'),
        accessor: 'rtuDeviceId',
      },
      {
        id: AssetEditorDataChannelColumnId.RtuChannelNumber,
        Header: t('ui.common.channel', 'Channel'),
        accessor: 'rtuChannelNumber',
      },
      {
        id: AssetEditorDataChannelColumnId.Type,
        Header: t('ui.common.type', 'Type'),
        // We use the accessor since sorting is done on the translated text
        // value, instead of the numeric enum
        accessor: (dataChannel: EditAssetDataChannel) =>
          dataChannelTypeTextMapping[dataChannel.type!] || '',
      },
      {
        id: AssetEditorDataChannelColumnId.IsVolumetric,
        Header: t('ui.datachannel.volumetric', 'Volumetric'),
        accessor: (row: EditAssetDataChannel) => {
          if (row.isVolumetric !== undefined) {
            return formatBooleanToYesOrNoString(row.isVolumetric, t);
          }
          return '';
        },
      },
      {
        id: AssetEditorDataChannelColumnId.ScaledMin,
        Header: t('ui.common.min', 'Min'),
        accessor: 'scaledMin',
        sortType: 'basic',
      },
      {
        id: AssetEditorDataChannelColumnId.ScaledMax,
        Header: t('ui.common.max', 'Max'),
        accessor: 'scaledMax',
        sortType: 'basic',
      },
      {
        id: AssetEditorDataChannelColumnId.ScaledUnitsAsText,
        Header: t('ui.common.units', 'Units'),
        accessor: 'scaledUnitsAsText',
      },
      {
        id: AssetEditorDataChannelColumnId.ProductName,
        Header: t('ui.common.product', 'Product'),
        accessor: 'productName',
      },
      {
        id: AssetEditorDataChannelColumnId.TankType,
        Header: t('ui.datachannel.tank', 'Tank'),
        accessor: 'tankType',
        // @ts-ignore
        Cell: (props) => tankTypeTextMapping[props.value] || ' ',
      },
      {
        id: AssetEditorDataChannelColumnId.IsPublished,
        Header: t('ui.datachannel.published', 'Published'),
        accessor: (row: EditAssetDataChannel) => {
          if (row.isPublished !== undefined) {
            return formatBooleanToYesOrNoString(row.isPublished, t);
          }
          return '';
        },
      },
      {
        id: AssetEditorDataChannelColumnId.PublishedComments,
        Header: t('ui.datachannel.publishedcomments', 'Published Comments'),
        accessor: 'publishedComments',
      },
    ],
    [selectedRows]
  );

  const expandedRows = React.useMemo(
    () =>
      records.reduce((prev, current) => {
        /* eslint-disable-next-line no-param-reassign */
        prev[
          // @ts-ignore
          `${groupByColumn}:${getNameByType(current.type, t)}`
        ] = true;
        return prev;
      }, {} as Record<string, boolean>),
    [records, groupByColumn, selectedRows]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    // Note: This is how to get rows that are expanded
    // state: { expanded },
  } = useTable(
    {
      initialState: {
        groupBy: groupByColumn,
        expanded: expandedRows,
      },
      // @ts-ignore
      columns,
      data,
      disableMultiSort: true,
      manualSortBy: false,
      expandSubRows: true,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGroupBy,
    useSortBy,
    useExpanded,
    useRowSelect,
    (hooks: Hooks<EditAssetDataChannel>) => {
      hooks.visibleColumns.push((hookColumns: any) => [
        {
          id: AssetEditorDataChannelColumnId.Selection,

          Header: ({ rows: _rows }) => {
            const selectableRows = _rows.filter(
              (row) => row.original?.dataChannelId
            );
            const areAllRowsSelected =
              !!selectableRows.length &&
              selectableRows.every(
                (row) => selectedRows[row?.original.dataChannelId || '']
              );
            return (
              <TableCellCheckbox
                onChange={() =>
                  setSelectedRows(
                    selectableRows.reduce<Record<string, boolean>>(
                      (mem, row) => {
                        mem[
                          row?.original.dataChannelId || ''
                        ] = !areAllRowsSelected;
                        return mem;
                      },
                      {}
                    )
                  )
                }
                checked={areAllRowsSelected}
                style={{ paddingTop: 0, paddingBottom: 0 }}
              />
            );
          },
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: Cell<EditAssetDataChannel>) => {
            const key = row?.original.dataChannelId || '';
            return (
              <>
                <TableCellCheckbox
                  onChange={() =>
                    setSelectedRows(
                      (
                        prevSelectedRows: Record<string, boolean>
                      ): Record<string, boolean> => {
                        const newSelectedRows = { ...prevSelectedRows };
                        newSelectedRows[key] = !newSelectedRows[key];
                        return newSelectedRows;
                      }
                    )
                  }
                  checked={!!selectedRows[key]}
                />
              </>
            );
          },
          defaultCanSort: false,
          disableSortBy: true,
        },
        ...hookColumns,
      ]);
    }
  );

  return (
    <div style={{ position: 'relative' }}>
      <div>
        {records.length === 0 && (
          <MessageBlock>
            <Box m={2}>
              <SearchCloudIcon />
            </Box>
            <LargeBoldDarkText>
              {t('ui.datachannel.empty', 'No Data Channels found')}
            </LargeBoldDarkText>
          </MessageBlock>
        )}
      </div>
      <div>
        {records.length > 0 && (
          <TableContainer>
            <Table
              aria-label="data channels table"
              size="small"
              {...getTableProps()}
            >
              <TableHead>
                {headerGroups.map(
                  (headerGroup: HeaderGroup<EditAssetDataChannel>) => (
                    <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers
                        .filter((column) => !column.isGrouped)
                        .filter(
                          (column) =>
                            column.id !==
                            AssetEditorDataChannelColumnId.ChannelName
                        )
                        .map((column) => {
                          const sortDirection = column.isSorted
                            ? column.isSortedDesc
                              ? 'desc'
                              : 'asc'
                            : undefined;
                          const isSelectionCell =
                            column.id ===
                            AssetEditorDataChannelColumnId.Selection;
                          return (
                            <TableHeadCell
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                              sortDirection={sortDirection}
                              align={isSelectionCell ? 'center' : 'inherit'}
                              aria-label={columnIdToAriaLabel(column.id)}
                              style={{
                                width: isSelectionCell ? 50 : 'inherit',
                                padding: isSelectionCell ? 0 : '7px 16px',
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
                    </TableHeadRow>
                  )
                )}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);

                  if (row.isGrouped) {
                    const groupedCell = row.cells.find(
                      (cell) => cell.isGrouped
                    );

                    return (
                      <TableGroupedRow {...row.getRowProps()}>
                        {groupedCell && (
                          <TableCell
                            colSpan={visibleColumns.length}
                            {...groupedCell.getCellProps()}
                            aria-label={columnIdToAriaLabel(
                              groupedCell.column.id
                            )}
                            style={{
                              padding: '10px 16px',
                              verticalAlign: 'middle',
                            }}
                          >
                            <Grid container alignItems="center" spacing={2}>
                              <Grid item>
                                <StyledChevronIcon
                                  {...row.getToggleRowExpandedProps()}
                                  {...(row.isExpanded && {
                                    style: { transform: 'rotate(90deg)' },
                                  })}
                                />
                              </Grid>
                              <Grid item>
                                <div
                                  style={{
                                    fontWeight: 500,
                                    verticalAlign: 'middle',
                                    display: 'flex',
                                  }}
                                >
                                  {groupedCell.render('Cell')}
                                  <StyledModificationText>
                                    &nbsp; ({row.subRows.length})
                                  </StyledModificationText>
                                </div>
                              </Grid>
                            </Grid>
                          </TableCell>
                        )}
                      </TableGroupedRow>
                    );
                  }

                  return (
                    <TableRow {...row.getRowProps()} style={{ height: 50 }}>
                      {row.cells
                        .filter(
                          (cell) =>
                            cell.column.id !==
                            AssetEditorDataChannelColumnId.ChannelName
                        )
                        .map((cell) => {
                          const isSelectionCell =
                            cell.column.id ===
                            AssetEditorDataChannelColumnId.Selection;
                          return (
                            <TableCell
                              {...cell.getCellProps()}
                              aria-label={columnIdToAriaLabel(cell.column.id)}
                              style={{
                                textAlign: isSelectionCell
                                  ? 'center'
                                  : 'inherit',
                                width: isSelectionCell ? 50 : 'inherit',
                                padding: isSelectionCell
                                  ? 0
                                  : '5px 24px 5px 16px',
                              }}
                            >
                              {cell.render('Cell')}
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default DataChannelTable;
