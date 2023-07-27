import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const retrieveCurrentUserAccessibleDomains = () => {
  return ApiService.UserService.user_RetrieveCurrentUserAccessibleDomains();
};

export const useRetrieveCurrentUserAccessibleDomains = (
  isEnabled: boolean = true
) => {
  return useQuery(
    [APIQueryKey.retrieveCurrentUserAccessibleDomains],
    () => retrieveCurrentUserAccessibleDomains(),
    { enabled: isEnabled, cacheTime: 1000 * 60 * 2, staleTime: 1000 * 60 * 2 }
  );
};
