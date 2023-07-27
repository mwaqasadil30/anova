import { RcmJournalItemStatusEnum, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetHornerCallHistoryRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  statuses?: RcmJournalItemStatusEnum[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const getHornerRtuCommLog = (request: GetHornerCallHistoryRequest) => {
  return ApiService.HornerRtuService.hornerRtu_RetrieveRtuCommlog(
    request.deviceId,
    request.beginTime,
    request.offset,
    request.limit,
    request.statuses,
    request.direction,
    request.endTime
  );
};

export const useGetHornerRtuCallHistory = (
  request?: GetHornerCallHistoryRequest
) => {
  return useQuery(
    [APIQueryKey.getHornerCallHistory, request],
    () => getHornerRtuCommLog(request!),
    {
      enabled: !!request,
    }
  );
};
