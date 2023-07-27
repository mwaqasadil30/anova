import { ActiveEventGetReq, ActiveEventGetResp } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

type RequestObj = ActiveEventGetReq;
type ResponseObj = ActiveEventGetResp[];

export const useRetrieveActiveEvents = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [records, setRecords] = useState<ResponseObj>([]);

  const retrieveActiveEvents = useCallback(
    (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
      setIsFetching(true);
      setResponseError(null);

      return AdminApiService.EventService.event_GetActiveEvents(
        request as RequestObj
      )
        .then((response) => {
          setRecords(response);
          return response;
        })
        .catch((error) => {
          setResponseError(error);
          console.error('Failed to retrieve active events', error);
          throw error;
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
        });
    },
    []
  );

  return {
    isFetching,
    isLoadingInitial,
    records,
    error: responseError,
    makeRequest: retrieveActiveEvents,
  };
};
