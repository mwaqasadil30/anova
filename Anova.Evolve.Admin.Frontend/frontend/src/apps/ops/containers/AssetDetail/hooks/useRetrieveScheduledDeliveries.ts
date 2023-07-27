import { ScheduledDeliveryDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery, UseQueryOptions } from 'react-query';

type Request = {
  dataChannelId: string;
  beginDate?: Date | undefined;
  endDate?: Date | undefined;
};

const retrieveScheduledDeliveries = (request: Request) => {
  return ApiService.DeliveryScheduleService.deliverySchedule_RetrieveScheduledDeliveries(
    request.dataChannelId,
    request.beginDate,
    request.endDate
  );
};

export const useRetrieveScheduledDeliveries = (
  request: Request,
  options?: UseQueryOptions<ScheduledDeliveryDto[]>
) => {
  return useQuery(
    [APIQueryKey.retrieveScheduledDeliveries, request],
    () => retrieveScheduledDeliveries(request),
    options
  );
};
