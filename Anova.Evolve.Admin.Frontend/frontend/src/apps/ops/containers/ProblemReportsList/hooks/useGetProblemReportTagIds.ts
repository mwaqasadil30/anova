import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getProblemReportTagIds = (domainId: string) => {
  return ApiService.TagService.tag_GetTags(domainId);
};

export const useGetProblemReportTagIds = (domainId?: string) => {
  return useQuery(
    [APIQueryKey.getProblemReportTags, domainId],
    () => getProblemReportTagIds(domainId!),
    { enabled: !!domainId }
  );
};
