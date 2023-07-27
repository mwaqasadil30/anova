import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getUserRolesForDomain = (effectiveDomainId: string) => {
  return ApiService.DomainRoleService.domainRole_GetAccessibleDomainsAndRole(
    effectiveDomainId
  );
};

export const useGetUserRolesForDomain = (effectiveDomainId?: string) => {
  return useQuery(
    [APIQueryKey.getUserRolesForDomain, effectiveDomainId],
    // Since we enable the query only if effectiveDomainId is set, we force the
    // type here
    () => getUserRolesForDomain(effectiveDomainId!),
    {
      enabled: !!effectiveDomainId,
    }
  );
};
