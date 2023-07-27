/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DataChannelDTO,
  DataChannelCategory,
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
import { MAX_GRAPHABLE_DATA_CHANNEL_COUNT } from 'env';
import round from 'lodash/round';
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
import { useDebounce } from 'react-use';
import { TableDataForDownload } from 'utils/format/dataExport';
import { isNumber } from 'utils/format/numbers';
import { getDigitalInputDisplayText } from 'utils/ui/digital-input';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { useGetLocationReadings } from '../../hooks/useGetLocationReadings';
import {
  AssetDetailTab,
  ChangeDataChannelToUnitMappingFunction,
  GraphProperties,
  ReadingsHookData,
} from '../../types';
import AssetCarousel from '../AssetCarousel';
import { getReadingsCacheKey } from '../AssetGraph/helpers';
import { filterAndFormatReadingsForTable } from './helpers';
import TableActionsAndPagination from './TableActionsAndPagination';

const getDataChannelKey = (dataChannelId?: string) =>
  `data-channel-${dataChannelId}`;

interface LocationState {
  tab?: AssetDetailTab;
  selectedDataChannelIdsForHistoryTable?: string[];
}

interface Props {
  assetTitle?: string | null;
  dataChannels?: DataChannelDTO[] | null;
  selectedDataChannelsForReadingsTable: DataChannelDTO[];
  graphProperties: GraphProperties;
  readingsData: ReadingsHookData;
  readingsDataForCsv: ReadingsHookData;
  isFetchingReadingsCsvData: boolean;
  graphedDataChannelsForCsvDownload?: DataChannelDTO[];
  tableStateForCsvDownload: TableDataForDownload<any> | null;
  setTableStateForCsvDownload: (tableData: TableDataForDownload<any>) => void;
  isFetchingDataChannel?: boolean;
  isSummarizedReadingsSelected?: boolean;
  isSummarizedReadingsCheckboxSelected?: boolean;
  dataChannelsToCacheReadingsAndForecasts: DataChannelDTO[];
  setGraphedDataChannelsForCsvDownload: (
    selectedDataChannels: DataChannelDTO[]
  ) => void;
  setSelectedDataChannelIdsForReadingsTable: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  handleChangeDataChannelToUnitMapping?: ChangeDataChannelToUnitMappingFunction;
  fetchRecords: () => void;
  openUpdateDisplayPriorityDialog: () => void;
  toggleIsSummarizedReadingsSelected: () => void;
}

const ReadingsTab = ({
  assetTitle,
  dataChannels,
  selectedDataChannelsForReadingsTable,
  graphProperties,
  readingsData,
  readingsDataForCsv,
  isFetchingReadingsCsvData,
  graphedDataChannelsForCsvDownload,
  tableStateForCsvDownload,
  setTableStateForCsvDownload,
  dataChannelsToCacheReadingsAndForecasts,
  setGraphedDataChannelsForCsvDownload,
  isFetchingDataChannel,
  isSummarizedReadingsSelected,
  isSummarizedReadingsCheckboxSelected,
  setSelectedDataChannelIdsForReadingsTable,
  handleChangeDataChannelToUnitMapping,
  fetchRecords,
  openUpdateDisplayPriorityDialog,
  toggleIsSummarizedReadingsSelected,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();

  const { fromDate, toDate } = graphProperties;

  // NOTE: We only handle one GPS channel on the asset at the moment.
  const gpsDataChannel = selectedDataChannelsForReadingsTable.find(
    (dataChannel) => dataChannel.dataChannelTypeId === DataChannelCategory.Gps
  );
  const getLocationReadingsApi = useGetLocationReadings(
    {
      dataChannelId: gpsDataChannel?.dataChannelId,
      startDate: fromDate,
      endDate: toDate,
    },
    // Cache the API response for GPS readings, similar to non GPS readings
    // which are cached manaully without react-query. This way, the API call
    // isn't constantly triggered if the user toggles the GPS data channel
    // on/off.
    { cacheTime: 1000 * 60, staleTime: 1000 * 60 }
  );

  const readingsMapping: Record<number, any> = {};
  const readingsMappingForCsv: Record<number, any> = {};

  selectedDataChannelsForReadingsTable.forEach((channel) => {
    const dataChannelKey = getDataChannelKey(channel.dataChannelId);
    const cacheKey = getReadingsCacheKey(channel);
    const cachedReadings = readingsData.cachedReadings[cacheKey]?.readings;
    const gpsReadings = getLocationReadingsApi.data?.locations;

    const formattedReadingsWithinDateRange = filterAndFormatReadingsForTable({
      dataChannel: channel,
      fromDate,
      toDate,
      gpsReadings,
      regularReadings: cachedReadings,
    });

    // Build the readingsMapping which maps a datetime to any data channel that
    // has a point recorded at that datetime
    formattedReadingsWithinDateRange?.forEach((reading) => {
      const dateTimeKey = reading.logTime?.getTime();
      const readingValue = reading.formattedValue;

      if (dateTimeKey && readingsMapping[dateTimeKey]) {
        readingsMapping[dateTimeKey][dataChannelKey] = readingValue;
      } else if (dateTimeKey) {
        readingsMapping[dateTimeKey] = {
          logTime: reading.logTime,
          [dataChannelKey]: readingValue,
        };
      }
    });
  });

  // CSV Logic that could be used in code above - seperated temporarily for debugging
  selectedDataChannelsForReadingsTable.forEach((channel) => {
    const dataChannelKey = getDataChannelKey(channel.dataChannelId);
    const cacheKey = getReadingsCacheKey(channel);
    const cachedCsvReadings =
      readingsDataForCsv.cachedReadings[cacheKey]?.readings;
    const gpsReadings = getLocationReadingsApi.data?.locations;

    const formattedReadingsWithinDateRangeForCsv = filterAndFormatReadingsForTable(
      {
        dataChannel: channel,
        fromDate,
        toDate,
        gpsReadings,
        regularReadings: cachedCsvReadings,
      }
    );

    // Build the readingsMappingForCsv which maps a datetime to any data channel that
    // has a point recorded at that datetime
    formattedReadingsWithinDateRangeForCsv?.forEach((reading) => {
      const dateTimeKey = reading.logTime?.getTime();
      const readingValue = reading.formattedValue;

      if (dateTimeKey && readingsMappingForCsv[dateTimeKey]) {
        readingsMappingForCsv[dateTimeKey][dataChannelKey] = readingValue;
      } else if (dateTimeKey) {
        readingsMappingForCsv[dateTimeKey] = {
          logTime: reading.logTime,
          [dataChannelKey]: readingValue,
        };
      }
    });
  });

  const allDataChannelKeys = selectedDataChannelsForReadingsTable
    .map((channel) => {
      const cacheKey = getReadingsCacheKey(channel);
      const readingsLength =
        channel.dataChannelTypeId === DataChannelCategory.Gps
          ? getLocationReadingsApi.data?.locations?.length
          : readingsData.cachedReadings[cacheKey]?.readings.length;
      return `${cacheKey}-${readingsLength}`;
    })
    .join(' ');

  const allDataChannelKeysForCsv = selectedDataChannelsForReadingsTable
    .map((channel) => {
      const cacheKey = getReadingsCacheKey(channel);
      const readingsLength =
        channel.dataChannelTypeId === DataChannelCategory.Gps
          ? getLocationReadingsApi.data?.locations?.length
          : readingsDataForCsv.cachedReadings[cacheKey]?.readings.length;
      return `${cacheKey}-${readingsLength}`;
    })
    .join(' ');

  const records = Object.values(readingsMapping);
  const recordsForCsv = Object.values(readingsMappingForCsv);

  const data = React.useMemo(() => records || [], [
    allDataChannelKeys,
    getLocationReadingsApi.isFetching,
    readingsData.isCachedReadingsApiFetching,
    readingsData.dataChannelForecastsApi.isFetching,
    // IMPORTANT: When the user changes timezone, the fromDate and toDates are
    // updated to match the new timezone, which should cause the data to be
    // re-filtered based on the newly selected timezone.
    fromDate,
    toDate,
  ]);

  const allUnsummarizedCsvData = React.useMemo(() => recordsForCsv || [], [
    allDataChannelKeysForCsv,
    getLocationReadingsApi.isFetching,
    isFetchingReadingsCsvData,
    readingsDataForCsv.dataChannelForecastsApi.isFetching,
    // IMPORTANT: When the user changes timezone, the fromDate and toDates are
    // updated to match the new timezone, which should cause the data to be
    // re-filtered based on the newly selected timezone.
    fromDate,
    toDate,
  ]);

  const dynamicColumns = useMemo(
    () =>
      dataChannels?.map((channel) => {
        const description = getDataChannelDTODescription(channel);
        const formattedUnits = channel.uomParams?.unit
          ? `(${channel.uomParams?.unit})`
          : '';

        const cacheKey = getReadingsCacheKey(channel);
        const summarizedReadingsPrefixed = readingsData.cachedReadings[cacheKey]
          ?.wereReadingsSummarized
          ? '*'
          : '';

        const header = [description, formattedUnits].filter(Boolean).join(' ');

        const formattedHeader = summarizedReadingsPrefixed.concat(header);

        const dataChannelKey = getDataChannelKey(channel.dataChannelId);

        return {
          id: dataChannelKey,
          Header: formattedHeader,
          // We format the value in the accessor instead of the Cell so when
          // the data's exported to a CSV, the value matches what the table
          // shows. It also removes the need to have a separate set of columns
          // when exporting to a CSV.
          accessor: (record: any) => {
            const value = record[dataChannelKey];

            switch (channel.dataChannelTypeId) {
              case DataChannelCategory.DigitalInput: {
                return getDigitalInputDisplayText({
                  value,
                  stateZeroText: channel.digitalState0Text,
                  stateOneText: channel.digitalState1Text,
                  stateTwoText: channel.digitalState2Text,
                  stateThreeText: channel.digitalState3Text,
                });
              }
              case DataChannelCategory.Gps:
                return value;
              default:
                return isNumber(value)
                  ? round(value, channel.uomParams?.decimalPlaces || 0)
                  : '';
            }
          },
          sortType:
            channel.dataChannelTypeId === DataChannelCategory.Gps
              ? 'basic'
              : 'number',
        };
      }),
    [allDataChannelKeys]
  );

  const dynamicColumnsForCsv = useMemo(
    () =>
      dataChannels?.map((channel) => {
        const description = getDataChannelDTODescription(channel);
        const formattedUnits = channel.uomParams?.unit
          ? `(${channel.uomParams?.unit})`
          : '';

        const cacheKey = getReadingsCacheKey(channel);
        const wereReadingsSummarized = readingsDataForCsv.cachedReadings[
          cacheKey
        ]?.wereReadingsSummarized
          ? '*'
          : '';

        const header = [description, formattedUnits].filter(Boolean).join(' ');

        const formattedHeader = wereReadingsSummarized.concat(header);

        const dataChannelKey = getDataChannelKey(channel.dataChannelId);

        return {
          id: dataChannelKey,
          Header: formattedHeader,
          // We format the value in the accessor instead of the Cell so when
          // the data's exported to a CSV, the value matches what the table
          // shows. It also removes the need to have a separate set of columns
          // when exporting to a CSV.
          accessor: (record: any) => {
            const value = record[dataChannelKey];

            switch (channel.dataChannelTypeId) {
              case DataChannelCategory.DigitalInput: {
                return getDigitalInputDisplayText({
                  value,
                  stateZeroText: channel.digitalState0Text,
                  stateOneText: channel.digitalState1Text,
                  stateTwoText: channel.digitalState2Text,
                  stateThreeText: channel.digitalState3Text,
                });
              }
              case DataChannelCategory.Gps:
                return value;
              default:
                return isNumber(value)
                  ? round(value, channel.uomParams?.decimalPlaces || 0)
                  : '';
            }
          },
          sortType:
            channel.dataChannelTypeId === DataChannelCategory.Gps
              ? 'basic'
              : 'number',
        };
      }),
    [allDataChannelKeysForCsv]
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
    [t, records.length, dynamicColumns?.length, allDataChannelKeys]
  );

  const columnsForCsv = React.useMemo(
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
      ...(dynamicColumnsForCsv || []),
    ],
    [
      t,
      recordsForCsv.length,
      dynamicColumnsForCsv?.length,
      allDataChannelKeysForCsv,
    ]
  );

  const hiddenColumns = dataChannels
    ?.filter(
      (channel) =>
        !selectedDataChannelsForReadingsTable.find(
          (selectedChannel) =>
            selectedChannel.dataChannelId === channel.dataChannelId
        )
    )
    .map((channel) => getDataChannelKey(channel.dataChannelId));

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
        hiddenColumns,
        sortBy: [
          {
            id: 'logTime',
            desc: true,
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

  const tableDataForCsvDownload = useTable<any>(
    {
      initialState: {
        pageSize: 100,
        pageIndex: 0,
        hiddenColumns,
        sortBy: [
          {
            id: 'logTime',
            desc: true,
          },
        ],
      },
      columns: columnsForCsv,
      data: allUnsummarizedCsvData,
      disableMultiSort: true,
      pageIndex: 0,
    },
    useSortBy,
    usePagination
  );

  const isFetching =
    getLocationReadingsApi.isFetching ||
    readingsData.isCachedReadingsApiFetching ||
    readingsData.dataChannelForecastsApi.isFetching;

  // Set the data to be used when exporting the table data to a CSV.
  // useDebounce is used since the table was being updated quickly (only twice)
  // which was causing the CSV file to be downloaded multiple times.
  useDebounce(
    () => {
      setTableStateForCsvDownload({
        rows: tableDataForCsvDownload.rows,
        visibleColumns: tableDataForCsvDownload.visibleColumns,
      });
    },
    200,
    [tableDataForCsvDownload.rows, tableDataForCsvDownload.visibleColumns]
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
    if (checked) {
      setSelectedDataChannelIdsForReadingsTable((prevState) => {
        const selectedDataChannels = [...prevState, dataChannel.dataChannelId!];

        // We limit the amount of selected(graphed) data channels via an
        // environment variable.
        const slicedSelectedDataChannels = selectedDataChannels.slice(
          Math.max(
            selectedDataChannels.length - MAX_GRAPHABLE_DATA_CHANNEL_COUNT,
            0
          )
        );
        return slicedSelectedDataChannels;
      });
    } else {
      setSelectedDataChannelIdsForReadingsTable((prevState) =>
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

  const logTimeColumnWidth = 200;
  const dataChannelColumnWidth = 150;
  const tableMinWidth =
    !visibleColumns || visibleColumns.length <= 1
      ? logTimeColumnWidth + dataChannelColumnWidth
      : (visibleColumns.length - 1) * dataChannelColumnWidth +
        logTimeColumnWidth;

  useEffect(() => {
    const selectedIds = selectedDataChannelsForReadingsTable
      .map((dataChannel) => dataChannel.dataChannelId)
      .filter(Boolean);
    history.replace(location.pathname, {
      tab: AssetDetailTab.Readings,
      selectedDataChannelIdsForHistoryTable: selectedIds,
    } as LocationState);
  }, [selectedDataChannelsForReadingsTable]);

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
        selectedDataChannels={selectedDataChannelsForReadingsTable}
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
              isSummarizedReadingsSelected={isSummarizedReadingsSelected}
              isSummarizedReadingsCheckboxSelected={
                isSummarizedReadingsCheckboxSelected
              }
              toggleIsSummarizedReadingsSelected={
                toggleIsSummarizedReadingsSelected
              }
              totalRows={rows.length}
              pageIndex={pageIndex}
              pageSize={pageSize}
              items={items}
              showPaginationControls={pageCount > 1}
              align="left"
              tableStateForCsvDownload={tableStateForCsvDownload}
              dataChannelsToCacheReadingsAndForecasts={
                dataChannelsToCacheReadingsAndForecasts
              }
              graphedDataChannelsForCsvDownload={
                graphedDataChannelsForCsvDownload
              }
              setGraphedDataChannelsForCsvDownload={
                setGraphedDataChannelsForCsvDownload
              }
              assetTitle={assetTitle}
              isApiFetchingForCsv={isFetchingReadingsCsvData}
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
                    aria-label="readings table"
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

export default ReadingsTab;
