import { ChartTagBaseDto, DataChannelCategory } from 'api/admin/api';
import { useMemo } from 'react';
import {
  TagNameToTimeSeriesDataMapping,
  TimeSeriesAggregationMode,
} from '../types';
import { useGetFreezerTimeSeries } from './useGetFreezerTimeSeries';

interface GetFreezerTimeSeriesRequest {
  freezerId?: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  dataChannels?: Omit<ChartTagBaseDto, 'init' | 'toJSON'>[] | null;
  numberOfBuckets?: number | undefined;
}

export const useGetFreezerTimeSeriesForDataChannels = (
  request: GetFreezerTimeSeriesRequest
) => {
  const {
    freezerId,
    startDate,
    endDate,
    numberOfBuckets,
    dataChannels,
  } = request;

  // Digital data channels use an aggregation of 'sum', while non-digital data
  // channels use an aggregation of 'mean' (AKA average)
  const nonDigitalInputTagIds = dataChannels
    ?.filter(
      (chartDataChannel) =>
        chartDataChannel.tagId &&
        chartDataChannel.dataChannelTypeId !== DataChannelCategory.DigitalInput
    )
    .map((chartDataChannel) => chartDataChannel.tagId);

  // NOTE: We only filter for tag IDs that are numbers (even if they're
  // numbers as strings) because the back-end may send back 'null'
  // If ANY tag is null because the data is set up incorrectly, the whole API
  // call will return nothing
  const joinedNonDigitalInputTagIds = nonDigitalInputTagIds
    ?.filter(Boolean)
    .join('-');

  const digitalInputTagIds = dataChannels
    ?.filter(
      (chartDataChannel) =>
        chartDataChannel.tagId &&
        chartDataChannel.dataChannelTypeId === DataChannelCategory.DigitalInput
    )
    .map((chartDataChannel) => chartDataChannel.tagId);

  const joinedDigitalInputTagIds = digitalInputTagIds
    ?.filter(Boolean)
    .join('-');

  const meanApi = useGetFreezerTimeSeries({
    freezerId,
    startDate,
    endDate,
    numberOfBuckets,
    aggregation: TimeSeriesAggregationMode.Mean,
    tags: joinedNonDigitalInputTagIds,
  });
  const sumApi = useGetFreezerTimeSeries({
    freezerId,
    startDate,
    endDate,
    numberOfBuckets,
    aggregation: TimeSeriesAggregationMode.Sum,
    tags: joinedDigitalInputTagIds,
  });

  const tagNameToTimeSeriesDataMapping = useMemo(() => {
    const cleanMeanData = meanApi.data || [];
    const cleanSumData = sumApi.data || [];
    const seriesData = cleanMeanData.concat(cleanSumData);
    return seriesData?.reduce<TagNameToTimeSeriesDataMapping>(
      (prev, current) => {
        prev[current.tagName!] = current;
        return prev;
      },
      {}
    );
  }, [meanApi.data, sumApi.data]);

  return {
    meanApi,
    sumApi,
    tagNameToTimeSeriesDataMapping,
  };
};
