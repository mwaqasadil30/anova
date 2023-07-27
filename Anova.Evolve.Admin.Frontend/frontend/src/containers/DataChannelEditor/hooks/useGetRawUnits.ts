import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getRawUnits = () => {
  return ApiService.DataChannelService.dataChannel_GetRawUnits();
};

export const useGetRawUnits = () => {
  return useQuery([APIQueryKey.getRawUnits], () => getRawUnits());
};
