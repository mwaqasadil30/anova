import { RcmJournalItemStatusEnum, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetMetron2CallHistoryRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  statuses?: RcmJournalItemStatusEnum[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const getMetronRtuCommLog = (request: GetMetron2CallHistoryRequest) => {
  return ApiService.MetronRtuService.metronRtu_RetrieveRtuCommlog(
    request.deviceId,
    request.beginTime,
    request.offset,
    request.limit,
    request.statuses,
    request.direction,
    request.endTime
  );
};

export const useGetMetronRtuCallHistory = (
  request?: GetMetron2CallHistoryRequest
) => {
  return useQuery(
    [APIQueryKey.getMetron2CallHistory, request],
    () => getMetronRtuCommLog(request!),
    {
      enabled: !!request,
    }
  );
};
