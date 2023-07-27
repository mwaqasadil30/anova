import { RtuPacketCategory, RtuCommDirection } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetFileRtuPacketsRequest {
  deviceId: string | null;
  beginTime?: Date | undefined;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  channels?: string[] | null | undefined;
  categories?: RtuPacketCategory[] | null | undefined;
  direction?: RtuCommDirection | null | undefined;
  endTime?: Date | null | undefined;
}

const getFileRtuPackets = (request: GetFileRtuPacketsRequest) => {
  return ApiService.FileRtuService.fileRtu_RetrieveRtuPackets(
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

export const useGetFileRtuPackets = (request?: GetFileRtuPacketsRequest) => {
  return useQuery(
    [APIQueryKey.getFileRtuDetails, request],
    () => getFileRtuPackets(request!),
    {
      enabled: !!request,
    }
  );
};
