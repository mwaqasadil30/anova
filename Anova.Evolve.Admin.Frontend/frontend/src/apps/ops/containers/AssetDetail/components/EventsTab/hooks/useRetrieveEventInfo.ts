/* eslint-disable indent */
import {
  EventInfoRecord,
  EventInfoRetrievalOptionsDto,
  EventRecordStatus,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
// TODO: Replace this with a general helper if needed
import { getFormattedTimeStampWithTimezone } from 'apps/ops/containers/EventsSummaryList/helpers';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';

type RequestObj = EventInfoRetrievalOptionsDto;

export const useRetrieveEventInfo = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>(null);

  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const recordsDefault: EventInfoRecord[] = [];
  const [records, setRecords] = useState<EventInfoRecord[]>(recordsDefault);

  const userSelectedTimeZone = useSelector(selectCurrentIanaTimezoneId);

  const retrieveEventInfo = useCallback(
    (request: Omit<EventInfoRetrievalOptionsDto, 'init' | 'toJSON'>) => {
      setIsFetching(true);
      setResponseError(null);

      const formattedFromDate = getFormattedTimeStampWithTimezone(
        request?.eventDateFrom,
        userSelectedTimeZone
      );

      const formattedToDate = getFormattedTimeStampWithTimezone(
        request?.eventDateTo,
        userSelectedTimeZone
      );

      return AdminApiService.EventService.retrieveEventInfoRecordsByOptions_RetrieveEventInfoRecordsByOptions(
        {
          ...request,
          eventDateFrom:
            request.eventStatus === EventRecordStatus.Active
              ? undefined
              : formattedFromDate,
          eventDateTo:
            request.eventStatus === EventRecordStatus.Active
              ? undefined
              : formattedToDate,
        } as RequestObj
      )
        .then((response) => {
          setRecords(
            response.retrieveEventInfoRecordsByOptionsResult?.records ||
              recordsDefault
          );
          const totalRecords =
            response.retrieveEventInfoRecordsByOptionsResult?.totalRecords || 0;
          setTotalRows(totalRecords);
          setPageCount(Math.ceil(totalRecords / request.itemsPerPage!));
          setResponseError(null);
        })
        .catch((error) => {
          setResponseError(error);
          console.error('Failed to retrieve event info', error);
          throw error;
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
        });
    },
    [userSelectedTimeZone]
  );

  return {
    isFetching,
    isLoadingInitial,
    totalRows,
    pageCount,
    records,
    error: responseError,
    makeRequest: retrieveEventInfo,
  };
};
