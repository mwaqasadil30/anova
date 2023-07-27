import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getDataChannelDetailsById = (dataChannelId: string) => {
  return ApiService.DataChannelService.dataChannel_RetrieveDataChannel(
    dataChannelId
  );
};

export const useGetDataChannelDetailsById = (dataChannelId: string) => {
  return useQuery(
    [APIQueryKey.getDataChannelDetailsById, dataChannelId],
    () => getDataChannelDetailsById(dataChannelId),
    {
      enabled: !!dataChannelId,
    }
  );
};
