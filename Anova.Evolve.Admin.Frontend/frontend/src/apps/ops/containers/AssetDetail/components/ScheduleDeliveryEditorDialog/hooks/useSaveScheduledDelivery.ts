import { ScheduledDeliveryDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = ScheduledDeliveryDto;
type ResponseObj = boolean;

const saveScheduledDelivery = (request: RequestObj) => {
  return ApiService.DeliveryScheduleService.deliverySchedule_SaveScheduledDelivery(
    request
  );
};

export const useSaveScheduledDelivery = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveScheduledDelivery(request),
    mutationOptions
  );
};
