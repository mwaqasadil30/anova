import { RtuPollStatusEnum } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { QueryObserverResult, useQueries, UseQueryOptions } from 'react-query';

type GetRtuPollStatusRequest = string[];

const getRtuPollStatus = (deviceId: string) => {
  if (deviceId) {
    return ApiService.RtuService.rtu_GetRtuPollStatus(deviceId);
  }
  return null;
};

export const useGetRtuPollStatus = (deviceIds: GetRtuPollStatusRequest) => {
  return useQueries(
    deviceIds.map((deviceId) => {
      return {
        queryKey: [APIQueryKey.getRtuPollStatus, deviceId],
        queryFn: () => getRtuPollStatus(deviceId),
        enabled: !!deviceId,
      };
    }) as UseQueryOptions<unknown, unknown, unknown>[]
  ) as QueryObserverResult<RtuPollStatusEnum, unknown>[];
};
