import { useCallback, useState } from 'react';
import AdminApiService from 'api/admin/ApiService';
import {
  EvolveGetDomainAdditionalByIdRequest,
  EvolveGetDomainAdditionalByIdResponse,
} from 'api/admin/api';

const useGetDomainAdditionalById = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState();
  const [response, setResponse] = useState<
    EvolveGetDomainAdditionalByIdResponse | null | undefined
  >();

  const fetchEditData = useCallback((domainId?: string) => {
    setIsFetching(true);
    return AdminApiService.GeneralService.getDomainAdditionalById_RetrieveDomainAdditionalById(
      {
        domainId,
      } as EvolveGetDomainAdditionalByIdRequest
    )
      .then((responseData) => {
        setResponse(responseData);
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return {
    isFetching,
    error: responseError,
    data: response,
    fetchEditData,
  };
};

export default useGetDomainAdditionalById;
