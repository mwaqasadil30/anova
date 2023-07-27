import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getRtuChannelInfoByRtuId = (
  rtuDeviceId: string,
  dataChannelId: string
) => {
  return ApiService.RtuChannelService.rtuChannel_Get(
    rtuDeviceId,
    dataChannelId
  );
};

export const useGetRtuChannelInfoByRtuId = (
  rtuDeviceId: string,
  dataChannelId: string
) => {
  return useQuery(
    [APIQueryKey.getRtuChannelInfo, rtuDeviceId, dataChannelId],
    () => getRtuChannelInfoByRtuId(rtuDeviceId, dataChannelId),
    {
      enabled: !!rtuDeviceId,
    }
  );
};
