import { UserDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type ResponseObj = UserDto;

export const useSaveUser = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseError, setResponseError] = useState<any>();
  const [responseData, setResponseData] = useState<
    ResponseObj | null | undefined
  >();

  const saveUser = (userDetail: UserDto) => {
    setIsFetching(true);
    setIsSubmitting(true);
    setResponseError(null);

    return ApiService.UserService.user_Save(userDetail)
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to update user', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
        setIsSubmitting(false);
      });
  };

  const reset = () => {
    setResponseData(undefined);
    setResponseError(null);
  };

  return {
    isFetching,
    isSubmitting,
    error: responseError,
    data: responseData,
    makeRequest: saveUser,
    reset,
  };
};
