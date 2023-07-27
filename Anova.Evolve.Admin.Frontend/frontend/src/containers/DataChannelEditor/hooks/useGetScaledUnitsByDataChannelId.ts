import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getScaledUnitsByDataChannelId = (dataChannelId: string) => {
  return ApiService.DataChannelService.dataChannel_GetScaledUnits(
    dataChannelId
  );
};

export const useGetScaledUnitsByDataChannelId = (dataChannelId: string) => {
  return useQuery([APIQueryKey.getScaledUnits], () =>
    getScaledUnitsByDataChannelId(dataChannelId)
  );
};
