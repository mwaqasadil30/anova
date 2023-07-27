import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetMetronRtuCommLogRequest {
  callJournalId: number;
  deviceId: string;
  callTime?: Date | undefined;
}

const getMetronRtuCommLogSessionHistory = (
  request: GetMetronRtuCommLogRequest
) => {
  return ApiService.MetronRtuService.metronRtu_RetrieveRtuCommlogSession(
    request.callJournalId,
    request.deviceId,
    request.callTime
  );
};

export const useGetMetronRtuCommLogSessionHistory = (
  request?: GetMetronRtuCommLogRequest
) => {
  return useQuery(
    [APIQueryKey.getMetron2CommLogSessionHistory, request],
    () => getMetronRtuCommLogSessionHistory(request!),
    {
      enabled: !!request,
      cacheTime: 1000 * 60,
      staleTime: 1000 * 60,
    }
  );
};
