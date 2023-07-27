/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DataChannelCategory,
  DataChannelDTO,
  UnitTypeEnum,
} from 'api/admin/api';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import FormatDateTime from 'components/FormatDateTime';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import {
  Cell,
  HeaderGroup,
  Row,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { isNumber } from 'utils/format/numbers';
import {
  AssetDetailTab,
  ChangeDataChannelToUnitMappingFunction,
  GraphProperties,
  ReadingsHookData,
} from '../../types';
import AssetCarousel from '../AssetCarousel';
import { getReadingsCacheKey } from '../AssetGraph/helpers';
import {
  buildForecastTableColumn,
  filterAndFormatForecastForTable,
  getDataChannelKey,
} from './helpers';
import TableActionsAndPagination from './TableActionsAndPagination';
import { ForecastReadingType } from './types';

interface LocationState {
  tab?: AssetDetailTab;
  selectedDataChannelsForForecastTable?: string[];
}

interface Props {
  assetTitle?: string | null;
  dataChannels?: DataChannelDTO[] | null;
  selectedDataChannelsForForecastTable: DataChannelDTO[];
  graphProperties: GraphProperties;
  readingsData: ReadingsHookData;
  isFetchingDataChannel?: boolean;
  setSelectedDataChannelIdsForForecastTable: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  handleChangeDataChannelToUnitMapping?: ChangeDataChannelToUnitMappingFunction;
  fetchRecords: () => void;
  openUpdateDisplayPriorityDialog: () => void;
}

const ForecastTab = ({
  assetTitle,
  dataChannels,
  selectedDataChannelsForForecastTable,
  graphProperties,
  readingsData,
  isFetchingDataChannel,
  setSelectedDataChannelIdsForForecastTable,
  handleChangeDataChannelToUnitMapping,
  fetchRecords,
  openUpdateDisplayPriorityDialog,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const { fromDate, toDate } = graphProperties;

  const data = useMemo(() => {
    const forecastMapping: Record<number, any> = {};

    selectedDataChannelsForForecastTable.forEach((channel) => {
      const dataChannelKey = getDataChannelKey(channel.dataChannelId);
      const cacheKey = getReadingsCacheKey(channel);
      const cachedForecast =
        readingsData.cachedForecastReadings[cacheKey]?.forecasts;

      const formattedReadingsWithinDateRange = filterAndFormatForecastForTable(
        cachedForecast
      );

      // Build the readingsMapping which maps a datetime to any data channel that
      // has a point recorded at that datetime
      formattedReadingsWithinDateRange?.forEach((reading) => {
        const dateTimeKey = reading.logTime?.getTime();
        const {
          estimatedScaledValue,
          highScaledValue,
          lowScaledValue,
        } = reading;

        if (dateTimeKey && forecastMapping[dateTimeKey]) {
          forecastMapping[dateTimeKey][dataChannelKey] = {
            estimatedScaledValue,
            highScaledValue,
            lowScaledValue,
          };
        } else if (dateTimeKey) {
          forecastMapping[dateTimeKey] = {
            logTime: reading.logTime,
            [dataChannelKey]: {
              estimatedScaledValue,
              highScaledValue,
              lowScaledValue,
            },
          };
        }
      });
    });

    return Object.values(forecastMapping);
  }, [
    selectedDataChannelsForForecastTable,
    readingsData.cachedForecastReadings,
    fromDate,
    toDate,
  ]);

  const allDataChannelKeys = selectedDataChannelsForForecastTable
    .map((channel) => {
      const cacheKey = getReadingsCacheKey(channel);
      const readingsLength =
        channel.dataChannelTypeId === DataChannelCategory.Gps &&
        readingsData.cachedReadings[cacheKey]?.readings.length;
      return `${cacheKey}-${readingsLength}`;
    })
    .join(' ');

  const dynamicColumns = useMemo(
    () =>
      selectedDataChannelsForForecastTable
        ?.map((channel) => {
          const dataChannelKey = getDataChannelKey(channel.dataChannelId);

          const hasHighScaledValue = isNumber(
            data?.[0]?.[dataChannelKey]?.highScaledValue
          );
          const hasLowScaledValue = isNumber(
            data?.[0]?.[dataChannelKey]?.lowScaledValue
          );

          const normalColumn = buildForecastTableColumn(
            t,
            channel,
            ForecastReadingType.Normal
          );
          const highColumn = hasHighScaledValue
            ? buildForecastTableColumn(t, channel, ForecastReadingType.High)
            : null;
          const lowColumn = hasLowScaledValue
            ? buildForecastTableColumn(t, channel, ForecastReadingType.Low)
            : null;

          return [normalColumn, lowColumn, highColumn].filter(Boolean);
        })
        .flat(),
    [selectedDataChannelsForForecastTable, data]
  );

  const columns = React.useMemo(
    () => [
      {
        id: 'logTime',
        Header: t('ui.common.time', 'Time'),
        sortType: 'datetime',
        accessor: 'logTime',
        Cell: ({ value }: Cell<any>) => {
          if (value) {
            return <FormatDateTime date={value} />;
          }
          return '';
        },
      },
      ...(dynamicColumns || []),
    ],
    [t, data.length, dynamicColumns?.length, allDataChannelKeys]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    pageCount,
    visibleColumns,
    prepareRow,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable<any>(
    {
      initialState: {
        pageSize: 100,
        pageIndex: 0,
        sortBy: [
          {
            id: 'logTime',
            desc: false,
          },
        ],
      },
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      disableMultiSort: true,
      pageIndex: 0,
    },
    useSortBy,
    usePagination
  );

  const tableStateForDownload = useMemo(
    () => ({
      rows,
      visibleColumns,
    }),
    [rows, visibleColumns]
  );

  const handleChangePage = (event: any, newPage: any) => {
    gotoPage(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageIndex + 1,
    onChange: handleChangePage,
  });

  const handleSelectedDataChannelCheckboxChange = (
    dataChannel: DataChannelDTO,
    checked: boolean
  ) => {
    // Currently we only allow one data channel to be selected at a time.
    // In the future we'll allow multiple data channels to be set shown on the
    // graph.
    if (checked) {
      setSelectedDataChannelIdsForForecastTable((prevState) => [
        ...prevState,
        dataChannel.dataChannelId!,
      ]);
    } else {
      setSelectedDataChannelIdsForForecastTable((prevState) =>
        prevState.filter(
          (existingDataChannelId) =>
            existingDataChannelId !== dataChannel.dataChannelId
        )
      );
    }

    // Reset the page number since a data channel was checked/unchecked
    handleChangePage(undefined, 1);
  };

  const handleSelectedDataChannelUnitChange = (
    dataChannelId: string,
    unit?: UnitTypeEnum | null
  ) => {
    const dataChannel = dataChannels?.find(
      (channel) => channel.dataChannelId === dataChannelId
    );
    if (dataChannel) {
      handleChangeDataChannelToUnitMapping?.([{ dataChannelId, unit }]);

      // Reset the page number since a data channel was checked/unchecked
      handleChangePage(undefined, 1);
    }
  };

  const { isFetching } = readingsData.dataChannelForecastsApi;

  const logTimeColumnWidth = 200;
  const dataChannelColumnWidth = 150;
  const tableMinWidth =
    !visibleColumns || visibleColumns.length <= 1
      ? logTimeColumnWidth + dataChannelColumnWidth
      : (visibleColumns.length - 1) * dataChannelColumnWidth +
        logTimeColumnWidth;

  useEffect(() => {
    const selectedIds = selectedDataChannelsForForecastTable
      .map((dataChannel) => dataChannel.dataChannelId)
      .filter(Boolean);
    history.replace(location.pathname, {
      tab: AssetDetailTab.Forecast,
      selectedDataChannelIdsForForecastTable: selectedIds,
    } as LocationState);
  }, [selectedDataChannelsForForecastTable]);

  return (
    <Box
      mt={2}
      height="100%"
      display="flex"
      flexDirection="column"
      flexGrow={1}
    >
      <AssetCarousel
        dataChannels={dataChannels}
        selectedDataChannels={selectedDataChannelsForForecastTable}
        isFetchingDataChannel={isFetchingDataChannel}
        handleChangeSelectedDataChannel={
          handleSelectedDataChannelCheckboxChange
        }
        handleChangeDataChannelToUnitMapping={
          handleSelectedDataChannelUnitChange
        }
        fetchRecords={fetchRecords}
        openUpdateDisplayPriorityDialog={openUpdateDisplayPriorityDialog}
      />
      {isFetching ? (
        <Box textAlign="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box py={1}>
            <TableActionsAndPagination
              totalRows={rows.length}
              pageIndex={pageIndex}
              pageSize={pageSize}
              items={items}
              showPaginationControls={pageCount > 1}
              align="left"
              tableStateForDownload={tableStateForDownload}
              assetTitle={assetTitle}
            />
          </Box>
          {!!page.length && (
            <BoxWithOverflowHidden
              pb={3}
              display="flex"
              flexDirection="column"
              flexGrow={1}
            >
              <DarkFadeOverlay darken={isFetching} height="100%">
                <TableContainer
                  // Use max height here since the amount of rows in the table
                  // may not exceed the height of the page. This allows the
                  // scrollbar to appear at the bottom of the short table instead
                  // of the bottom of the page.
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    display: 'inline-block',
                  }}
                >
                  <Table
                    aria-label="forecast table"
                    {...getTableProps()}
                    style={{ minWidth: tableMinWidth, borderTop: 0 }}
                    stickyHeader
                  >
                    <TableHead>
                      {headerGroups.map((headerGroup: HeaderGroup<any>) => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column, index, array) => {
                            const isLast = index === array.length - 1;
                            const sortDirection = column.isSorted
                              ? column.isSortedDesc
                                ? 'desc'
                                : 'asc'
                              : undefined;

                            const width =
                              column.id === 'logTime'
                                ? logTimeColumnWidth
                                : !isLast
                                ? dataChannelColumnWidth
                                : undefined;

                            return (
                              <TableHeadCell
                                {...column.getHeaderProps(
                                  column.getSortByToggleProps()
                                )}
                                sortDirection={sortDirection}
                                style={{
                                  padding: '8px 16px',
                                  width,
                                  lineHeight: '1.2rem',
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
                      {page.map((row: Row<any>) => {
                        prepareRow(row);

                        return (
                          <TableRow
                            {...row.getRowProps()}
                            style={{ height: 35 }}
                          >
                            {row.cells
                              .filter((cell) => !cell.isPlaceholder)
                              .map((cell) => {
                                return (
                                  <TableCell
                                    {...cell.getCellProps()}
                                    style={{
                                      padding: '8px 16px',
                                    }}
                                  >
                                    {cell.render('Cell', {
                                      disabled: isFetching,
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
              </DarkFadeOverlay>
            </BoxWithOverflowHidden>
          )}
        </>
      )}
    </Box>
  );
};

export default ForecastTab;
