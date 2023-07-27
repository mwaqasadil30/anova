import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getUserWatchlist = (userId?: string, domainId?: string) => {
  if (!userId || !domainId) {
    return null;
  }
  return ApiService.UserWatchListService.userWatchList_GetUserWatchList(
    userId,
    domainId
  );
};

export const useGetUserWatchlist = (userId?: string, domainId?: string) => {
  return useQuery(
    [APIQueryKey.getUserWatchList, { userId, domainId }],
    () => getUserWatchlist(userId, domainId),
    {
      enabled: !!userId && !!domainId,
      cacheTime: 1000 * 60 * 2,
      staleTime: 1000 * 60 * 2,
    }
  );
};
