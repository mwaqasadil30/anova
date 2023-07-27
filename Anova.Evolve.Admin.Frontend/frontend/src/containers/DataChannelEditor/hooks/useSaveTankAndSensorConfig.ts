import { DataChannelTankAndSensorConfigDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = DataChannelTankAndSensorConfigDTO;

type ResponseObj = boolean;

const saveTankAndSensorConfig = (request: RequestObj) => {
  return ApiService.DataChannelService.dataChannel_SaveTankAndSensorConfig(
    request
  );
};

export const useSaveTankAndSensorConfig = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveTankAndSensorConfig(request),
    mutationOptions
  );
};
