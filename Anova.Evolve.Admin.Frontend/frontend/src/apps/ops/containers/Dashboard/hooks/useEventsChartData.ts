import {
  EvolveGetHistoricalActiveEventsRequest,
  EvolveGetHistoricalActiveEventsResponse,
  EvolveHistoricalActiveEvent,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectActiveDomain,
  selectCurrentTimezone,
} from 'redux-app/modules/app/selectors';

type ResponseBody = EvolveGetHistoricalActiveEventsResponse;
type RequestBody = EvolveGetHistoricalActiveEventsRequest;

const GetHistoricalActiveInventoryLevelEvents = (body: RequestBody) => {
  return ApiService.DashboardService.getHistoricalActiveEvents_GetHistoricalActiveEvents(
    body
  ).then((data: ResponseBody) => data.result || []);
};

const useDomainId = () => {
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;
  return domainId || '';
};

const useTimeZoneSystemId = () => {
  const activeTimeZone = useSelector(selectCurrentTimezone);
  const systemId = activeTimeZone.timezone?.systemId;
  return systemId || '';
};

type Event = EvolveHistoricalActiveEvent;

export const useEventsChartData = () => {
  const domainId = useDomainId();
  const timeZoneSystemId = useTimeZoneSystemId();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    GetHistoricalActiveInventoryLevelEvents({
      domainId,
      timeZoneSystemId,
    } as RequestBody)
      .then(setEvents)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [domainId, timeZoneSystemId]);

  return { events, isLoading, error };
};
