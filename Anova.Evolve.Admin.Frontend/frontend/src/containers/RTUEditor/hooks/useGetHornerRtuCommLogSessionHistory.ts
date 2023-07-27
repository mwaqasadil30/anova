import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetHornerRtuCommLogRequest {
  callJournalId: number;
  deviceId: string;
  callTime?: Date | undefined;
}

const getHornerRtuCommLogSessionHistory = (
  request: GetHornerRtuCommLogRequest
) => {
  return ApiService.HornerRtuService.hornerRtu_RetrieveRtuCommlogSession(
    request.callJournalId,
    request.deviceId,
    request.callTime
  );
};

export const useGetHornerRtuCommLogSessionHistory = (
  request?: GetHornerRtuCommLogRequest
) => {
  return useQuery(
    [APIQueryKey.getHornerCommLogSessionHistory, request],
    () => getHornerRtuCommLogSessionHistory(request!),
    {
      enabled: !!request,
      cacheTime: 1000 * 60,
      staleTime: 1000 * 60,
    }
  );
};
