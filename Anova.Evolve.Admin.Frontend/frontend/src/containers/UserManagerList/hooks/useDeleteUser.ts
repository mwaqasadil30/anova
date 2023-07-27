import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type ResponseObj = boolean;
// NOTE: replace with user-related api once its completed
export const useDeleteUser = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>();
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const deleteUser = (userId: string) => {
    setIsFetching(true);
    setResponseError(null);
    return ApiService.UserService.user_DeleteUserByUserId(userId)
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to delete user', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: deleteUser,
  };
};
