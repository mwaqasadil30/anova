import {
  EventInfoRecord,
  EventInfoRetrievalOptionsDto,
  EventRecordStatus,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { getFormattedTimeStampWithTimezone } from '../helpers';
import { InactiveEventSummaryApiHook } from '../types';

const recordsDefault: EventInfoRecord[] = [];

export const useRetrieveEventInfoRecordsByOptions = (): InactiveEventSummaryApiHook => {
  const userSelectedTimeZone = useSelector(selectCurrentIanaTimezoneId);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [records, setRecords] = useState<EventInfoRecord[]>(recordsDefault);

  const [startTimer, setStartTimer] = useState<Date | null>(null);
  const [endTimer, setEndTimer] = useState<Date | null>(null);
  const [endPageTimer, setEndPageTimer] = useState<Date | null>(null);

  const retrieveEventInfoRecordsByOptions = useCallback(
    (requestOptions: Omit<EventInfoRetrievalOptionsDto, 'init' | 'toJSON'>) => {
      setIsFetching(true);
      setStartTimer(new Date());
      setEndTimer(null);
      setEndPageTimer(null);

      const formattedFromDate = getFormattedTimeStampWithTimezone(
        requestOptions?.eventDateFrom,
        userSelectedTimeZone
      );

      const formattedToDate = getFormattedTimeStampWithTimezone(
        requestOptions?.eventDateTo,
        userSelectedTimeZone
      );

      AdminApiService.EventService.retrieveEventInfoRecordsByOptions_RetrieveEventInfoRecordsByOptions(
        {
          ...requestOptions,
          eventDateFrom:
            requestOptions.eventStatus === EventRecordStatus.Active
              ? undefined
              : formattedFromDate,
          eventDateTo:
            requestOptions.eventStatus === EventRecordStatus.Active
              ? undefined
              : formattedToDate,
        } as EventInfoRetrievalOptionsDto
      )
        .then((response) => {
          setEndTimer(new Date());
          setRecords(
            response.retrieveEventInfoRecordsByOptionsResult?.records ||
              recordsDefault
          );
          const totalRecords =
            response.retrieveEventInfoRecordsByOptionsResult?.totalRecords || 0;
          setTotalRows(totalRecords);
          setPageCount(Math.ceil(totalRecords / requestOptions.itemsPerPage!));
          setResponseError(null);
        })
        .catch((error) => {
          setEndTimer(new Date());
          setResponseError(error);
        })
        .finally(() => {
          setIsFetching(false);
          setIsLoadingInitial(false);
          setEndPageTimer(new Date());
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
    startTimer,
    endTimer,
    endPageTimer,
    apiDuration: isFetching ? null : Number(endTimer) - Number(startTimer),
    makeRequest: retrieveEventInfoRecordsByOptions,
  };
};
