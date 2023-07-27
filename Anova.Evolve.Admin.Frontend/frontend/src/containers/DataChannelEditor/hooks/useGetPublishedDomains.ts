import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getPublishedDomains = () => {
  return ApiService.DomainService.domain_FindPublishedDomains();
};

export const useGetPublishedDomains = () => {
  return useQuery([APIQueryKey.getPublishedDomains], () =>
    getPublishedDomains()
  );
};
