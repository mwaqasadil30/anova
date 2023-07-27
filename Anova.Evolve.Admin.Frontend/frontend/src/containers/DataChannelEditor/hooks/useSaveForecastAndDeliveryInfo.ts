import { DataChannelSaveForecastDeliveryInfoDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelSaveForecastDeliveryInfoDTO;

type ResponseObj = boolean;

const saveForecastAndDeliveryInfo = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveForcastDeliveryInfo(
    request
  );
};

export const useSaveForecastAndDeliveryInfo = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveForecastAndDeliveryInfo(request),
    mutationOptions
  );
};
