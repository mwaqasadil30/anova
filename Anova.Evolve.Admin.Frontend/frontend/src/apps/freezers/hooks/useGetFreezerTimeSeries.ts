import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import moment from 'moment';
import { useQuery } from 'react-query';
import { TimeSeriesAggregationMode } from '../types';

interface GetFreezerTimeSeriesRequest {
  freezerId?: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  tags?: string | null | undefined;
  numberOfBuckets?: number | undefined;
  aggregation?: TimeSeriesAggregationMode | null | undefined;
}

const getFreezerTimeSeries = (request: GetFreezerTimeSeriesRequest) => {
  if (!request.freezerId) {
    return null;
  }

  const {
    freezerId,
    startDate,
    endDate,
    tags,
    numberOfBuckets,
    aggregation,
  } = request;

  // Customize the number of buckets
  let cleanNumberOfBuckets = numberOfBuckets;
  if (!numberOfBuckets) {
    const numberOfHoursInRange = moment(endDate).diff(
      moment(startDate),
      'hours'
    );
    const numberOfMinutesInRange = moment(endDate).diff(
      moment(startDate),
      'minutes'
    );

    // Custom logic provided to calculate the number of buckets based on the
    // amount of hours in the date range
    if (numberOfHoursInRange <= 2) {
      cleanNumberOfBuckets = numberOfMinutesInRange;
    } else if (numberOfHoursInRange <= 96) {
      cleanNumberOfBuckets = 96;
    } else {
      cleanNumberOfBuckets = numberOfHoursInRange;
    }
  }

  return ApiService.FreezerAssetService.freezerAsset_GetFreezerTimeSeries(
    freezerId,
    startDate,
    endDate,
    tags,
    cleanNumberOfBuckets,
    aggregation
  );
};

export const useGetFreezerTimeSeries = (
  request: GetFreezerTimeSeriesRequest
) => {
  return useQuery(
    [APIQueryKey.getFreezerChart, request],
    () => getFreezerTimeSeries(request),
    {
      enabled:
        !!request.freezerId &&
        !!request.startDate &&
        !!request.endDate &&
        !!request.tags &&
        !!request.aggregation,
    }
  );
};
