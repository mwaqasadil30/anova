import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getAssetGroupsForDomain = (effectiveDomainId: string) => {
  return ApiService.DomainAssetGroupService.domainAssetGroup_GetAccessibleDomainsAndRole(
    effectiveDomainId
  );
};

export const useGetAssetGroupsForDomain = (effectiveDomainId?: string) => {
  return useQuery(
    [APIQueryKey.getAssetGroupsForDomain, effectiveDomainId],
    // Since we enable the query only if effectiveDomainId is set, we force the
    // type here
    () => getAssetGroupsForDomain(effectiveDomainId!),
    {
      enabled: !!effectiveDomainId,
    }
  );
};
