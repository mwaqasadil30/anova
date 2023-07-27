import { ResponseModelOfListOfUserGetResp } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

type ResponseObj = ResponseModelOfListOfUserGetResp;

export const useRetrieveUsersByDomainId = () => {
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);
  const [responseData, setResponseData] = useState<
    ResponseObj | undefined | null
  >();

  const retrieveUsersByDomainId = useCallback((domainId: string) => {
    setIsFetching(true);
    setResponseError(null);

    return ApiService.UserService.user_GetUsersByDomainId(domainId)
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to retrieve user info', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
        setIsLoadingInitial(false);
      });
  }, []);

  return {
    isFetching,
    isLoadingInitial,
    error: responseError,
    data: responseData,
    makeRequest: retrieveUsersByDomainId,
  };
};
