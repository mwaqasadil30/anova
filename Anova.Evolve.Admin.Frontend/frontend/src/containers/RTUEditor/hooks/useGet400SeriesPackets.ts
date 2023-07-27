import { RtuPacketCategory, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface Get400SeriesPacketsRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  channels?: string[] | null | undefined;
  categories?: RtuPacketCategory[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const get400SeriesPackets = (request: Get400SeriesPacketsRequest) => {
  return ApiService.RtuService.rtu_RetrieveRtuPackets(
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

export const useGet400SeriesPackets = (
  request?: Get400SeriesPacketsRequest
) => {
  return useQuery(
    [APIQueryKey.get400SeriesPackets, request],
    () => get400SeriesPackets(request!),
    {
      enabled: !!request,
    }
  );
};
