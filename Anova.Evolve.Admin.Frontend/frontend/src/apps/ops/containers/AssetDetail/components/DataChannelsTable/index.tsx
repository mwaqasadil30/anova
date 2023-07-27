/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelCategory,
  DataChannelDTO,
  EventRuleCategory,
  RtuPollStatusEnum,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import { ReactComponent as GreenCircle } from 'assets/icons/green-circle.svg';
import { ReactComponent as RedCircle } from 'assets/icons/red-circle.svg';
import CustomTooltip from 'components/CustomTooltip';
import FormatDateTime from 'components/FormatDateTime';
import ShowEnabledOrDisabledIcon from 'components/ShowEnabledOrDisabledIcon';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED } from 'env';
import round from 'lodash/round';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { Cell, Column, Hooks, useSortBy, useTable } from 'react-table';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import { selectCanAccessAdminDataChannelEditor } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { canAccessDataChannelEditorByDataChannelType } from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import { getRowColour, renderImportance } from 'utils/ui/helpers';
import { CommonGraphDataChannelProps, ReadingsHookData } from '../../types';
import DataChannelActionCell from './components/DataChannelActionCell';
import DataChannelLatestReadingCell from './components/DataChannelLatestReadingCell';
import DataChannelSelectionCell from './components/DataChannelSelectionCell';
import NameCell from './components/NameCell';
import {
  columnIdToAriaLabel,
  DataChannelColumnId,
  getColumnWidth,
  tableRowHeight,
} from './helpers';

const StyledStatusText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  /* 
  min-width is applied in-line in the component so when the event status column
  has no values, it defaults to its initial/smaller empty column width.
  */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const StyledTableCell = styled(TableCell)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: 23px;
  width: inherit;
`;

const StyledBox = styled(Box)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
`;

const StyledTableRow = styled(TableRow)<{
  // Typescript syntax to retrieve the internal type of the array.
  // For example, if you had a type like type ListOfDogs = Dog[], and you
  // wanted to just pull the type `Dog`, you can do ListOfDogs[number].
  $dataChannel: CommonGraphDataChannelProps['dataChannels'][number];
}>`
  height: 40px;

  ${({ $dataChannel }) => {
    const hasMissingData = !!$dataChannel.uomParams?.eventRules?.find(
      (rule) => rule.eventRuleType === EventRuleCategory.MissingData
    );

    const eventInventoryStatus = [...($dataChannel.uomParams?.eventRules || [])]
      .reverse()
      .find((rule) => rule.isActive)?.inventoryStatus;

    const rowColour = getRowColour({
      eventInventoryStatus,
      eventImportanceLevel: $dataChannel.eventImportanceLevel,
      hasMissingData,
    });
    return rowColour
      ? `
      // Get the third "Description" column. We skip the first two because they
      // are "selection" and "action" columns (Checkbox / ellipsis icon) that
      // do not need any colours/styles applied to them.
      > td:nth-child(3).MuiTableCell-body *, 
      > .MuiTableCell-body
      {
        color: ${rowColour}; font-weight: bold;
      }
       `
      : '';
  }}}
`;

const StyledGreenCircle = styled(GreenCircle)`
  height: 10px;
  width: 10px;
`;
const StyledRedCircle = styled(RedCircle)`
  height: 10px;
  width: 10px;
`;

const defaultDataChannels: CommonGraphDataChannelProps['dataChannels'] = [];

interface Props {
  dataChannels: CommonGraphDataChannelProps['dataChannels'];
  selectedDataChannels: CommonGraphDataChannelProps['selectedDataChannels'];
  isPublishedAsset: CommonGraphDataChannelProps['isPublishedAsset'];
  minimumSelectionCount: CommonGraphDataChannelProps['minimumSelectionCount'];
  isFetchingDataChannel: CommonGraphDataChannelProps['isFetchingDataChannel'];
  readingsData: ReadingsHookData;
  canSelectDataChannel?: CommonGraphDataChannelProps['canSelectDataChannel'];
  handleChangeSelectedDataChannel: CommonGraphDataChannelProps['handleChangeSelectedDataChannel'];
  handleChangeDataChannelToUnitMapping: CommonGraphDataChannelProps['handleChangeDataChannelToUnitMapping'];
  openUpdateDisplayPriorityDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
}

const DataChannelTable = ({
  dataChannels,
  selectedDataChannels,
  isPublishedAsset,
  minimumSelectionCount,
  isFetchingDataChannel,
  readingsData,
  canSelectDataChannel,
  handleChangeSelectedDataChannel,
  handleChangeDataChannelToUnitMapping,
  openUpdateDisplayPriorityDialog,
  setDataChannelsResult,
  fetchRecords,
}: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const records = dataChannels || defaultDataChannels;
  const data = React.useMemo(() => records, [records]);

  const canAccessDataChannelEditor = useSelector(
    selectCanAccessAdminDataChannelEditor
  );

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const goToDataChannelEditor = (dataChannelId: string | null | undefined) => {
    if (dataChannelId) {
      const pathname = generatePath(routes.dataChannelManager.edit, {
        dataChannelId,
      });

      history.push(pathname);
    }
  };

  const columns: Column<DataChannelDTO>[] = React.useMemo(
    () => [
      {
        Header: DataChannelColumnId.Description as string,
        accessor: DataChannelColumnId.Description,
        Cell: NameCell,
        sortType: caseInsensitive,
      },
      {
        Header: t('ui.dataChannel.siteNumber', 'Site Number') as string,
        accessor: DataChannelColumnId.DataChannelSiteNumber,
        sortType: caseInsensitive,
      },
      {
        Header: t('ui.assetdetail.lb', 'LB') as string,
        accessor: DataChannelColumnId.IsLBShellEnabled,
        Cell: (cell: Cell<DataChannelDTO>) => {
          const { row } = cell;
          const { isLBShellEnabled } = row.original;

          if (isLBShellEnabled === null) {
            return '-';
          }

          return (
            <StyledBox>
              <ShowEnabledOrDisabledIcon isEnabled={isLBShellEnabled} />
            </StyledBox>
          );
        },
      },
      {
        Header: t('ui.common.channel', 'Channel') as string,
        accessor: DataChannelColumnId.ChannelNumber,
        sortType: caseInsensitive,
      },
      {
        id: DataChannelColumnId.LatestReadingValue,
        Header: t('ui.assetdetail.lastreading', 'Last Reading') as string,
        // @ts-ignore
        accessor: (row: DataChannelDTO) => {
          const readingValue = row.uomParams?.latestReadingValue;
          const latitude = readingValue;
          const longitude = row.uomParams?.latestReadingValue2;
          if (
            row.dataChannelTypeId === DataChannelCategory.Gps &&
            isNumber(latitude) &&
            isNumber(longitude)
          ) {
            return `${round(latitude!, 6)}, ${round(longitude!, 6)}`;
          }

          const decimalPlaces = row.uomParams?.decimalPlaces;
          if (isNumber(readingValue)) {
            return `${round(readingValue!, decimalPlaces)}`;
          }
          return '';
        },
        Cell: DataChannelLatestReadingCell,
        sortType: 'alphanumeric',
      },
      {
        Header: t('ui.common.readingtime', 'Reading Time') as string,
        accessor: DataChannelColumnId.ReadingTime,
        Cell: (cell: Cell<DataChannelDTO>) => {
          const cellValue = cell.row.original;
          const { latestReadingTimestamp } = cellValue;

          if (latestReadingTimestamp) {
            return <FormatDateTime date={latestReadingTimestamp} />;
          }
          return '';
        },
        sortType: sortNullableDates,
      },
      {
        id: DataChannelColumnId.EventStatus,
        Header: t('ui.common.status', 'Status') as string,
        // @ts-ignore
        accessor: (row: DataChannelDTO) => {
          return (
            <>
              {(
                <StyledStatusText
                  style={{ minWidth: row.eventStatus ? '250px' : 'initial' }}
                >
                  {row.eventStatus}
                </StyledStatusText>
              ) || t('enum.eventimportanceleveltype.normal', 'Normal')}
            </>
          );
        },
        Cell: (cell: Cell<DataChannelDTO>) => {
          const { row, value } = cell;
          const importanceLevel = row.original.eventImportanceLevel;
          const fullEventStatusText = row.original.eventStatus || '';

          return (
            <CustomTooltip title={fullEventStatusText}>
              <div>
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item xs={1}>
                    {renderImportance(importanceLevel)}
                  </Grid>
                  <Grid item xs={11} aria-label="status">
                    {value}
                  </Grid>
                </Grid>
              </div>
            </CustomTooltip>
          );
        },
        sortType: caseInsensitive,
      },
      {
        id: DataChannelColumnId.PercentFull,
        Header: t('enum.unittype.percentfull', '% Full') as string,
        accessor: (row: DataChannelDTO) => {
          const value = row.uomParams?.latestReadingValueInPercentFull;
          const decimalPlaces = row.uomParams?.decimalPlaces;

          if (isNumber(value)) {
            return `${round(value!, decimalPlaces)}%`;
          }
          return null;
        },
        sortType: 'number',
      },
      {
        Header: t('ui.common.product', 'Product') as string,
        accessor: DataChannelColumnId.ProductDescription,
        sortType: caseInsensitive,
      },
      {
        Header: t('ui.datachannel.rtudeviceid', 'RTU Device ID') as string,
        accessor: DataChannelColumnId.RtuDeviceId,
        sortType: caseInsensitive,
      },
      {
        Header: t('ui.rtu400series.pollstate', 'Poll State') as string,
        accessor: DataChannelColumnId.RtuPollStatus,
        sortType: caseInsensitive,
        Cell: (cell: Cell<DataChannelDTO>) => {
          const { row } = cell;
          const { rtuPollStatus } = row.original;

          if (
            rtuPollStatus === RtuPollStatusEnum.NotPollableBatteryLow ||
            rtuPollStatus === RtuPollStatusEnum.PollingDisabled
          ) {
            return (
              <StyledBox>
                <StyledRedCircle />
              </StyledBox>
            );
          }

          if (
            rtuPollStatus ===
              RtuPollStatusEnum.InstantaneousAndHistoricalReadings ||
            rtuPollStatus === RtuPollStatusEnum.InstantaneousReadings
          ) {
            return (
              <StyledBox>
                <StyledGreenCircle />
              </StyledBox>
            );
          }
          return null;
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<DataChannelDTO>(
    {
      initialState: {
        hiddenColumns: isAirProductsEnabledDomain
          ? []
          : [
              DataChannelColumnId.IsLBShellEnabled,
              DataChannelColumnId.DataChannelSiteNumber,
            ],
      },
      // @ts-ignore
      columns,
      data,
      disableMultiSort: true,
      manualSortBy: false,
      expandSubRows: true,
    },
    useSortBy,
    (hooks: Hooks<DataChannelDTO>) => {
      hooks.visibleColumns.push((hookColumns: any) => {
        const selectionColumn = {
          id: DataChannelColumnId.Selection,
          Header: '',
          defaultCanSort: false,
          disableSortBy: true,
          Cell: DataChannelSelectionCell,
        };
        const actionColumn = {
          id: DataChannelColumnId.Action,
          Header: t('ui.common.menu', 'Menu'),
          defaultCanSort: false,
          disableSortBy: true,
          Cell: DataChannelActionCell,
        };

        return [selectionColumn, actionColumn, ...hookColumns];
      });
    }
  );

  const getRowProps = () => {
    return {
      style: {
        height: tableRowHeight,
      },
    };
  };

  return (
    <TableContainer>
      <Table aria-label="data channels table" size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const sortDirection = column.isSorted
                  ? column.isSortedDesc
                    ? 'desc'
                    : 'asc'
                  : undefined;
                const isSelectionCell = column.id === 'selection';
                const isActionCell = column.id === DataChannelColumnId.Action;

                const isNarrowCell = isSelectionCell || isActionCell;
                return (
                  <TableHeadCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sortDirection={sortDirection}
                    align={isNarrowCell ? 'center' : 'inherit'}
                    aria-label={columnIdToAriaLabel(column.id)}
                    style={{
                      minWidth: getColumnWidth(
                        column.id,
                        isAirProductsEnabledDomain
                      ),
                      width: isNarrowCell ? 40 : 'inherit',
                      padding: isNarrowCell ? 0 : '7px 16px',
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
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <StyledTableRow
                {...row.getRowProps(getRowProps())}
                $dataChannel={row.original}
              >
                {row.cells.map((cell) => {
                  const isSelectionCell =
                    cell.column.id === DataChannelColumnId.Selection;
                  const isActionCell =
                    cell.column.id === DataChannelColumnId.Action;

                  const isNarrowCell = isSelectionCell || isActionCell;

                  const isBeingGraphed = !!selectedDataChannels.find(
                    (channel) =>
                      channel.dataChannelId === cell.row.original.dataChannelId!
                  );

                  const checkboxNeedsToRemainSelected =
                    isBeingGraphed &&
                    !!minimumSelectionCount &&
                    selectedDataChannels.length <= minimumSelectionCount;
                  const disableCheckbox =
                    isFetchingDataChannel || checkboxNeedsToRemainSelected;

                  const isDescriptionCell =
                    cell.column.id === DataChannelColumnId.Description;

                  const showDataChannelEditorLink =
                    !isPublishedAsset &&
                    isDescriptionCell &&
                    canAccessDataChannelEditor &&
                    // NOTE: Temporarily disable links for specific data channel types
                    canAccessDataChannelEditorByDataChannelType(
                      cell.row.original.dataChannelTypeId
                    ) &&
                    IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED;

                  return (
                    <StyledTableCell
                      // @ts-ignore
                      {...cell.getCellProps()}
                      aria-label={columnIdToAriaLabel(cell.column.id)}
                      style={{
                        textAlign: isNarrowCell ? 'center' : 'inherit',

                        padding: isNarrowCell ? 0 : '5px 16px',
                        cursor: showDataChannelEditorLink
                          ? 'pointer'
                          : undefined,
                      }}
                      onClick={() => {
                        if (showDataChannelEditorLink) {
                          goToDataChannelEditor(
                            cell.row.original.dataChannelId
                          );
                        }
                      }}
                    >
                      {cell.render('Cell', {
                        // This passes props to each cell, even though
                        // some of these props are only specific to
                        // some cells (example: DataChannelActionCell)
                        isBeingGraphed,
                        disableCheckbox,
                        disableUnitOfMeasureButtons: isFetchingDataChannel,
                        showDataChannelEditorLink,
                        isPublishedAsset,
                        dataChannels,
                        readingsData,
                        selectedDataChannels,
                        canSelectDataChannel,
                        handleChangeSelectedDataChannel,
                        handleChangeDataChannelToUnitMapping,
                        openUpdateDisplayPriorityDialog,
                        setDataChannelsResult,
                        fetchRecords,
                      })}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataChannelTable;
