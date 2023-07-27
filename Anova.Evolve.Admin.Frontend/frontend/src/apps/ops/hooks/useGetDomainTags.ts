import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getDomainTags = (domainId: string) => {
  return ApiService.TagService.tag_GetTags(domainId);
};

export const useGetDomainTags = (domainId?: string) => {
  return useQuery(
    [APIQueryKey.getDomainTags, domainId],
    () => getDomainTags(domainId!),
    { enabled: !!domainId }
  );
};
