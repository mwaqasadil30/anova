import { RtuPacketCategory, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetSmsRtuPacketsRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  channels?: string[] | null | undefined;
  categories?: RtuPacketCategory[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const getSmsRtuPackets = (request: GetSmsRtuPacketsRequest) => {
  return ApiService.SmsRtuService.smsRtu_RetrieveRtuPackets(
    request.deviceId,
    request.beginTime,
    request.offset,
    request.limit,
    request.channels,
    request.categories,
    request.direction,
    request.endTime
  );
};

export const useGetSmsRtuPackets = (request?: GetSmsRtuPacketsRequest) => {
  return useQuery(
    [APIQueryKey.getSmsRtuPackets, request],
    () => getSmsRtuPackets(request!),
    {
      enabled: !!request,
    }
  );
};
