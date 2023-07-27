import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetModbusRtuCommLogRequest {
  callJournalId: number;
  deviceId: string;
  callTime?: Date | undefined;
}

const getModbusRtuCommLogSessionHistory = (
  request: GetModbusRtuCommLogRequest
) => {
  return ApiService.ModbusRtuService.modbusRtu_RetrieveRtuCommlogSession(
    request.callJournalId,
    request.deviceId,
    request.callTime
  );
};

export const useGetModbusRtuCommLogSessionHistory = (
  request?: GetModbusRtuCommLogRequest
) => {
  return useQuery(
    [APIQueryKey.getModbusCommLogSessionHistory, request],
    () => getModbusRtuCommLogSessionHistory(request!),
    {
      enabled: !!request,
      cacheTime: 1000 * 60,
      staleTime: 1000 * 60,
    }
  );
};
