import { RcmJournalItemStatusEnum, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetModbusCallHistoryRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  statuses?: RcmJournalItemStatusEnum[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const getModbusRtuCommLog = (request: GetModbusCallHistoryRequest) => {
  return ApiService.ModbusRtuService.modbusRtu_RetrieveRtuCommlog(
    request.deviceId,
    request.beginTime,
    request.offset,
    request.limit,
    request.statuses,
    request.direction,
    request.endTime
  );
};

export const useGetModbusRtuCallHistory = (
  request?: GetModbusCallHistoryRequest
) => {
  return useQuery(
    [APIQueryKey.getModbusCallHistory, request],
    () => getModbusRtuCommLog(request!),
    {
      enabled: !!request,
    }
  );
};
