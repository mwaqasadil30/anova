import {
  EvolveRetrieveAuditHistoryByOptionsRequest,
  EvolveRetrieveAuditHistoryByOptionsResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

type Request = EvolveRetrieveAuditHistoryByOptionsRequest;
type Response = EvolveRetrieveAuditHistoryByOptionsResponse['retrieveAuditHistoryByOptionsResult'];

const useRetrieveAuditHistory = () => {
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState();
  const [responseData, setResponseData] = useState<Response>();

  const fetchAuditHistory = useCallback(
    (request: Omit<Request, 'init' | 'toJSON'>) => {
      setIsFetching(true);

      return AdminApiService.GeneralService.retrieveAuditHistoryByOptions_RetrieveAuditHistoryByOptions(
        request as Request
      )
        .then((response) => {
          const data = response.retrieveAuditHistoryByOptionsResult;
          setResponseData(data);
          return data;
        })
        .catch((error) => {
          setResponseError(error);
          throw error;
        })
        .finally(() => {
          setIsFetching(false);
          setIsFetchingInitial(false);
        });
    },
    []
  );

  return {
    isFetching,
    isFetchingInitial,
    error: responseError,
    data: responseData,
    fetchData: fetchAuditHistory,
  };
};

export default useRetrieveAuditHistory;
