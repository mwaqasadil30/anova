import { DomainEventsDto, EventRuleCategory } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectActiveDomainId,
  selectCurrentIanaTimezoneId,
} from 'redux-app/modules/app/selectors';

const recordsDefault: DomainEventsDto[] = [];

export const useGetActiveDomainEvents = () => {
  const domainId = useSelector(selectActiveDomainId);
  const userSelectedTimeZone = useSelector(selectCurrentIanaTimezoneId);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number | undefined>();
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any | null>(null);
  const [records, setRecords] = useState<DomainEventsDto[]>(recordsDefault);

  const [startTimer, setStartTimer] = useState<Date | null>(null);
  const [endTimer, setEndTimer] = useState<Date | null>(null);
  const [endPageTimer, setEndPageTimer] = useState<Date | null>(null);

  const getActiveDomainEvents = useCallback(
    (
      eventTypeIds?: EventRuleCategory[] | null | undefined,
      tagIds?: number[] | null | undefined
    ) => {
      setIsFetching(true);
      setStartTimer(new Date());
      setEndTimer(null);
      setEndPageTimer(null);

      AdminApiService.EventService.event_GetDomainActiveEvents(
        domainId!,
        eventTypeIds,
        tagIds
      )
        .then((response) => {
          setEndTimer(new Date());
          setRecords(response);
          const totalRecords = response.length || 0;
          setTotalRows(totalRecords);
          setPageCount(1);
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
    makeRequest: getActiveDomainEvents,
  };
};
