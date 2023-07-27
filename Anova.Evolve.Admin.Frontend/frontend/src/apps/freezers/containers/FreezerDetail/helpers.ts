/* eslint-disable indent */
import { DefaultChartDto, UserChartDto } from 'api/admin/api';
import { GRAPH_VALUE_ROUND_DECIMAL_PLACES } from 'apps/freezers/constants';
import {
  TagIdToHistoricalReadingsApiMapping,
  TagNameToTimeSeriesDataMapping,
} from 'apps/freezers/types';
import { TFunction } from 'i18next';
import round from 'lodash/round';
import moment from 'moment';
import { ReadingsMappingValue } from './types';

export const getDataChannelsOrTagsForChart = (
  chart: DefaultChartDto | UserChartDto | undefined
) => {
  return chart && 'chartDataChannels' in chart
    ? chart?.chartDataChannels
    : chart && 'chartTags' in chart
    ? chart.chartTags
    : [];
};

export const formatChartDataForCsv = (
  t: TFunction,
  chart: DefaultChartDto | UserChartDto,
  tagNameToTimeSeriesDataMapping: TagNameToTimeSeriesDataMapping | undefined,
  chartIdToBulkTankDataChannelMapping: Record<string, string[] | undefined>,
  historicalReadingsMapping: TagIdToHistoricalReadingsApiMapping
) => {
  const readingsMapping: Record<string, ReadingsMappingValue> = {};

  const dataChannelsOrTags = getDataChannelsOrTagsForChart(chart);
  // Build a list of column names for the data channels
  const dataChannelHeaderColumns = dataChannelsOrTags?.map((channel) => {
    const timeSeriesData =
      tagNameToTimeSeriesDataMapping?.[channel.description!];

    const unitText = timeSeriesData?.units ? `(${timeSeriesData?.units})` : '';
    return [channel.description?.trim(), unitText].filter(Boolean).join(' ');
  });

  const selectedBulkTankDataChannelIds =
    chartIdToBulkTankDataChannelMapping[chart.chartId!] || [];
  const bulkTankDataChannels = selectedBulkTankDataChannelIds.map(
    (dataChannelId) => historicalReadingsMapping[dataChannelId]
  );

  const bulkTankDataChannelHeaderColumns = bulkTankDataChannels.map(
    (channelInfo) => {
      const { description } = channelInfo;
      const rawUnits = channelInfo.api.data.unitOfMeasureAsText;
      const units = rawUnits ? `(${rawUnits})` : '';
      return [description, units].filter(Boolean).join(' ');
    }
  );

  const headerRow = [
    t('ui.common.time', 'Time'),
    ...(dataChannelHeaderColumns || []),
    ...(bulkTankDataChannelHeaderColumns || []),
  ];

  // Build the readingsMapping which has key, value pairs of timestamps to the
  // data available on that timestamp, which includes the logTime, and data
  // channel values.
  // Example:
  // {
  //   "2021-04-30T00:00:00Z": {
  //     logTime: Date(2021, 04, 30, 0, 0, 0),
  //     '1234-1234-1234-1234': 123.12,
  //     '2345-2345-2345-2345': 0.21,
  //     // ... etc.
  //   },
  //   // ... etc.
  // }
  dataChannelsOrTags?.forEach((channel) => {
    const dataChannelKey = channel.tagId;
    const timeSeriesData =
      tagNameToTimeSeriesDataMapping?.[channel.description!];

    timeSeriesData?.data?.forEach((reading) => {
      const timestamp = reading[0];
      const readingValue = reading[1];
      const logTime = moment(timestamp as string).toDate();

      if (timestamp && readingsMapping[timestamp]) {
        readingsMapping[timestamp][dataChannelKey!] = readingValue;
      } else if (timestamp) {
        readingsMapping[timestamp] = {
          logTime,
          [dataChannelKey!]: readingValue,
        };
      }
    });
  });

  // Add to the readingsMapping, this time with the bulk tank data channels
  // readings data
  bulkTankDataChannels.forEach((dataChannelInfo) => {
    const dataChannelKey = dataChannelInfo.api.data.dataChannelId;

    dataChannelInfo.api.data.readings?.forEach((reading) => {
      const timestamp = reading.logTime?.toISOString();
      const readingValue = reading.value;
      const { logTime } = reading;

      if (timestamp && readingsMapping[timestamp]) {
        readingsMapping[timestamp][dataChannelKey!] = readingValue;
      } else if (timestamp) {
        readingsMapping[timestamp] = {
          logTime: logTime!,
          [dataChannelKey!]: readingValue,
        };
      }
    });
  });

  // Build the data rows for the CSV, sorted by logTime in descending order.
  const dataRows = Object.keys(readingsMapping)
    // Sort dates in descending order (similar to the ReadingsTab on Asset
    // Details)
    .sort((a, b) => {
      const timestamp1 = moment(a).valueOf();
      const timestamp2 = moment(b).valueOf();
      return timestamp2 - timestamp1;
    })
    .map((timestamp) => {
      const data = readingsMapping[timestamp];
      const dataChannelReadingValues = dataChannelsOrTags?.map((channel) => {
        const readingValue = round(
          data?.[channel.tagId!],
          GRAPH_VALUE_ROUND_DECIMAL_PLACES
        );

        return readingValue;
      });

      const bulkTankDataChannelreadingValues = bulkTankDataChannels.map(
        (dataChannelInfo) => {
          const readingValue = round(
            data?.[dataChannelInfo.api.data.dataChannelId!],
            GRAPH_VALUE_ROUND_DECIMAL_PLACES
          );

          return readingValue;
        }
      );
      return [
        moment(timestamp).format(),
        ...(dataChannelReadingValues || []),
        ...(bulkTankDataChannelreadingValues || []),
      ];
    });

  const csvData = [headerRow, ...dataRows];

  return csvData;
};
