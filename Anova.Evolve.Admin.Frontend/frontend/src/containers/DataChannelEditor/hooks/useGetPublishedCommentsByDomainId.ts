import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getPublishedCommentsByDomainId = (domainId: string) => {
  return ApiService.DataChannelService.dataChannel_GetPublishedComments(
    domainId
  );
};

export const useGetPublishedCommentsByDomainId = (domainId: string) => {
  return useQuery(
    [APIQueryKey.getPublishedCommentsByDomainId, domainId],
    () => getPublishedCommentsByDomainId(domainId),
    {
      enabled: !!domainId,
    }
  );
};
