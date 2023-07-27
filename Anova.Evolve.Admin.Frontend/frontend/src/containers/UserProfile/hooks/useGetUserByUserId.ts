import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getUserByUserId = (userId?: string) => {
  if (!userId) {
    return null;
  }

  return ApiService.UserService.user_GetUserByUserId(userId);
};

export const useGetUserByUserId = (userId?: string) => {
  return useQuery(
    [APIQueryKey.getUserByUserId, userId],
    () => getUserByUserId(userId),
    {
      enabled: !!userId,
    }
  );
};
