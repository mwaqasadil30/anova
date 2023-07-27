import { DataChannelReadingDTO, UnitTypeEnum } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import {
  QueryObserverResult,
  useQueries,
  useQuery,
  UseQueryOptions,
} from 'react-query';
import { isNumber } from 'utils/format/numbers';

interface GetHistoricalReadingsByBulkTankTagIdRequest {
  tagId: string;
  startDate: Date; // not null in api, is this ok?
  endDate: Date; // not null in api, is this ok?
  units: UnitTypeEnum | null;
}

interface GetMultipleHistoricalReadingsByBulkTankTagIdRequest {
  tagIds: string[];
  startDate: Date;
  endDate: Date;
}

const getHistoricalReadingsByBulkTankTagId = ({
  tagId,
  startDate,
  endDate,
  units,
}: GetHistoricalReadingsByBulkTankTagIdRequest) => {
  return ApiService.HistoricalReadingsService.historicalReadings_Get(
    tagId,
    startDate,
    endDate,
    // @ts-ignore
    // NOTE: The generated API doesnt allow us passing in null
    isNumber(units) ? units : ''
  );
};

export const useGetHistoricalReadingsByBulkTankTagId = (
  request: GetHistoricalReadingsByBulkTankTagIdRequest
) => {
  return useQuery(
    [APIQueryKey.getHistoricalReadingsByBulkTankTagId, request],
    () => getHistoricalReadingsByBulkTankTagId(request)
  );
};

export const useGetMultipleHistoricalReadingsByBulkTankTagId = (
  request: GetMultipleHistoricalReadingsByBulkTankTagIdRequest
) => {
  return useQueries(
    request.tagIds.map((tagId) => {
      const individualRequest: GetHistoricalReadingsByBulkTankTagIdRequest = {
        tagId,
        startDate: request.startDate,
        endDate: request.endDate,
        units: null,
      };
      return {
        queryKey: [
          APIQueryKey.getHistoricalReadingsByBulkTankTagId,
          individualRequest,
        ],
        queryFn: () => getHistoricalReadingsByBulkTankTagId(individualRequest),
        cacheTime: 1000 * 60,
        staleTime: 1000 * 60,
      };
    }) as UseQueryOptions<unknown, unknown, unknown>[]
  ) as QueryObserverResult<DataChannelReadingDTO, unknown>[];
};
