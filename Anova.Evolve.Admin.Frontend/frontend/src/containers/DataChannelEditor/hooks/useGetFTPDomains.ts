import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getFtpDomains = () => {
  return ApiService.DataChannelService.dataChannel_GetFtpDomains();
};

export const useGetFtpDomains = () => {
  return useQuery([APIQueryKey.getFtpDomains], () => getFtpDomains());
};
