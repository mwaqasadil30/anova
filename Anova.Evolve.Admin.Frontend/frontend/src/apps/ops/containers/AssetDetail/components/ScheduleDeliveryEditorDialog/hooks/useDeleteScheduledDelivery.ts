import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type ResponseObj = boolean;

const deleteScheduledDelivery = (deliveryScheduleId: string) => {
  return ApiService.DeliveryScheduleService.deliverySchedule_DeleteScheduledDelivery(
    deliveryScheduleId
  );
};

export const useDeleteScheduledDelivery = (
  mutationOptions?: UseMutationOptions<ResponseObj, unknown, string, unknown>
) => {
  return useMutation(
    (deliveryScheduleId: string) => deleteScheduledDelivery(deliveryScheduleId),
    mutationOptions
  );
};
