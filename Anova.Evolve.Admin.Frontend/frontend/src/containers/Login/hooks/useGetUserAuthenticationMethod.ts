import { GetUserAuthenticationProviderDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

type Request = string | null;
type Response = GetUserAuthenticationProviderDto;

export const useGetUserAuthenticationMethod = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>();
  const [responseData, setResponseData] = useState<Response>();

  const getAuthenticationMethods = (username: Request) => {
    setIsFetching(true);
    setResponseData(undefined);
    setResponseError(null);

    return ApiService.AuthenticationService.authentication_GetUserAuthenticationProvider(
      username
    )
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to get authentication methods', error);
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
    makeRequest: getAuthenticationMethods,
  };
};
