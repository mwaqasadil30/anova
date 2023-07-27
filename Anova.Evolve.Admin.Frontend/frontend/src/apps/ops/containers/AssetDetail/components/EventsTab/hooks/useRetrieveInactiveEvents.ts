import { InactiveEventGetReq, InactiveEventGetResp } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { getFormattedTimeStampWithTimezone } from 'apps/ops/containers/EventsSummaryList/helpers';

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';

type RequestObj = InactiveEventGetReq;
type ResponseObj = InactiveEventGetResp[];

export const useRetrieveInactiveEvents = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [records, setRecords] = useState<ResponseObj>([]);

  const userSelectedTimeZone = useSelector(selectCurrentIanaTimezoneId);

  const retrieveInactiveEvents = useCallback(
    (request: Omit<RequestObj, 'init' | 'toJSON'>) => {
      setIsFetching(true);
      setResponseError(null);

      const formattedFromDate = getFormattedTimeStampWithTimezone(
        request?.startDate,
        userSelectedTimeZone
      );

      const formattedToDate = getFormattedTimeStampWithTimezone(
        request?.endDate,
        userSelectedTimeZone
      );

      return AdminApiService.EventService.event_GetInactiveEvents({
        ...request,
        startDate: formattedFromDate,
        endDate: formattedToDate,
      } as RequestObj)
        .then((response) => {
          setRecords(response);
          return response;
        })
        .catch((error) => {
          setResponseError(error);
          console.error('Failed to retrieve inactive events', error);
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
    makeRequest: retrieveInactiveEvents,
  };
};
